import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { errorResponse, successResponse } from '../api';
import { sanitizeUser, verifyAuthToken } from '../auth';
import { CollectionNames, collections } from '../db';
import { IBoard, IComment, ITask, ISanitizedUser, IUser } from '../models';

const router = express.Router();
export default router;

type IAggregatedBoard = Omit<IBoard, 'userIds' | 'adminIds'> & {
  users: ISanitizedUser[];
  admins: ISanitizedUser[];
};

async function getAggregatedBoards(
  userId: ObjectId,
  boardId: ObjectId | null
): Promise<IAggregatedBoard[]> {
  const cursor = collections.boards().aggregate();

  // Only match a board with ID if specified
  if (boardId) {
    cursor.match({
      _id: boardId,
      $or: [{ userIds: userId }, { adminIds: userId }],
    });
  }

  // Lookup users from userId
  cursor.lookup({
    from: CollectionNames.Users,
    localField: 'userIds',
    foreignField: '_id',
    as: 'users',
  });

  // Look up admins from adminId
  cursor.lookup({
    from: CollectionNames.Users,
    localField: 'adminIds',
    foreignField: '_id',
    as: 'admins',
  });

  // Remove fields for user/admin IDs, and user sensitive info
  cursor.project({
    userIds: 0,
    adminIds: 0,
    'users.passwordHash': 0,
    'admins.passwordHash': 0,
  });

  const boards = (await cursor.toArray()) as IAggregatedBoard[];

  return boards;
}

/**************************************************
 * Creating a new board
 **************************************************/

type CreateBoardRequest = {
  name: string;
};

type CreateBoardResponse = IBoard;

router.post('/', async (req, res) => {
  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  const body = req.body as CreateBoardRequest;

  if (!body?.name) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  try {
    const creatorId = new ObjectId(userId);
    const board: IBoard = {
      _id: new ObjectId(),
      name: body.name,
      userIds: [],
      adminIds: [creatorId],
      tasks: [],
    };

    const result = await collections.boards().insertOne(board);
    if (!result.acknowledged) {
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      return;
    }

    successResponse<CreateBoardResponse>(res, board);
  } catch (err) {
    console.error('Error occured: ', err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

/**************************************************
 * Getting a board's info by ID
 **************************************************/

type GetBoardByIdResponse = Omit<IBoard, 'userIds' | 'adminIds'> & {
  users: ISanitizedUser[];
  admins: ISanitizedUser[];
};

router.get('/:boardId', async (req, res) => {
  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  if (!ObjectId.isValid(req.params.boardId)) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const boardId = new ObjectId(req.params.boardId);
  const boards = await getAggregatedBoards(userId, boardId);

  if (!boards || boards.length < 1) {
    errorResponse(res, 'Board does not exist');
    return;
  }

  successResponse<GetBoardByIdResponse>(res, boards[0]);
});

/**************************************************
 * Get info about all boards
 **************************************************/

type GetAllBoardsResponse = IAggregatedBoard[];

router.get('/', async (req, res) => {
  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  const boards = await getAggregatedBoards(userId, null);
  if (!boards) {
    errorResponse(res, 'Error fetching boards');
    return;
  }

  successResponse<GetAllBoardsResponse>(res, boards);
});

/**************************************************
 * Join a board
 **************************************************/

type JoinBoardResponse = {};

router.post('/:boardId/join', async (req, res) => {
  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  if (!ObjectId.isValid(req.params.boardId)) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const boardObjId = new ObjectId(req.params.boardId);
  const result = await collections.boards().updateOne(
    {
      _id: boardObjId,
      $not: {
        adminIds: userId,
      },
    },
    {
      $addToSet: {
        userIds: userId,
      },
    }
  );

  if (result.modifiedCount <= 0) {
    errorResponse(res, 'Board does not exist');
    return;
  }

  successResponse<JoinBoardResponse>(res, {});
});

/**************************************************
 * Create a new task on a board
 **************************************************/

type CreateTaskRequest = {
  name: string;
  description: string;
  assignedUserIds?: ObjectId[];
  status?: 'todo' | 'inprogress' | 'done';
};
type CreateTaskResponse = ITask;

router.post('/:boardId/tasks', async (req, res) => {
  const data = req.body as CreateTaskRequest;

  if (!data || !data?.name || !data?.description) {
    errorResponse(res, 'Invalid message body', StatusCodes.BAD_REQUEST);
    return;
  }

  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  if (!ObjectId.isValid(req.params.boardId)) {
    errorResponse(res, 'Invalid board ID', StatusCodes.BAD_REQUEST);
    return;
  }

  // Creating this to ensure the user can't inject weird properties into tasks
  const newTask: ITask = {
    _id: new ObjectId(),
    name: data.name,
    description: data?.description,
    assignedUserIds: data?.assignedUserIds || [],
    status: data?.status || 'todo',
    comments: [],
    createdAt: new Date(),
    createdBy: userId,
  };

  const boardObjId = new ObjectId(req.params.boardId);
  const result = await collections.boards().updateOne(
    {
      _id: boardObjId,
      $or: [{ userIds: userId }, { adminIds: userId }],
    },
    {
      $push: {
        tasks: newTask,
      },
    }
  );

  if (result.modifiedCount <= 0) {
    errorResponse(res, 'Board does not exist');
    return;
  }

  successResponse<CreateTaskResponse>(res, newTask);
});

/**************************************************
 * Return tasks that is assigned to user
 **************************************************/

type UserAssignedTasksResponse = ITask[];

router.get('/boards/:boardId/your-tasks', async (req, res) => {
  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  if (!ObjectId.isValid(req.params.boardId)) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const boardObjId = new ObjectId(req.params.boardId);
  const board = await collections.boards().findOne({
    _id: boardObjId,
    $or: [{ userIds: userId }, { adminIds: userId }],
  });

  if (!board) {
    errorResponse(res, 'Board does not exist');
    return;
  }

  let userTasks = new Array<ITask>();
  const tasks = board.tasks;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].assignedUserIds.includes(userId)) {
      userTasks.push(tasks[i]);
    }
  }

  successResponse<UserAssignedTasksResponse>(res, userTasks);
});

/**************************************************
 * Return tasks that user created on board
 **************************************************/

type UserCreatedTasksResponse = ITask[];

router.get('/boards/:boardId/your-created-tasks', async (req, res) => {
  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  if (!ObjectId.isValid(req.params.boardId)) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const boardObjId = new ObjectId(req.params.boardId);
  const board = await collections.boards().findOne({
    _id: boardObjId,
    $or: [{ userIds: userId }, { adminIds: userId }],
  });

  if (!board) {
    errorResponse(res, 'Board does not exist');
    return;
  }

  let createdTasks = new Array<ITask>();
  const tasks = board.tasks;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].createdBy === userId) {
      createdTasks.push(tasks[i]);
    }
  }

  successResponse<UserCreatedTasksResponse>(res, createdTasks);
});
