import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { errorResponse, successResponse } from '../api';
import { verifyAuthToken } from '../auth';
import { collections } from '../db';
import { IBoard, IComment, ITask } from '../models';

const router = express.Router();
export default router;

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

type GetBoardByIdResponse = IBoard;

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
  const board = await collections.boards().findOne({
    _id: boardId,
    $or: [{ userIds: userId }, { adminIds: userId }],
  });

  if (!board) {
    errorResponse(res, 'Board does not exist');
    return;
  }

  successResponse<GetBoardByIdResponse>(res, board);
});

/**************************************************
 * Get info about all boards
 **************************************************/

type GetAllBoardsResponse = IBoard[];

router.get('/', async (req, res) => {
  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  const boards = await collections
    .boards()
    .find({
      $or: [{ userIds: userId }, { adminIds: userId }],
    })
    .toArray();

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
};
type CreateTaskResponse = ITask;

router.post('/:boardId/tasks', async (req, res) => {
  const data = req.body as CreateTaskRequest;

  if (!data?.description || !data?.name) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  if (!ObjectId.isValid(req.params.boardId)) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const task: ITask = {
    _id: new ObjectId(),
    assignedUserIds: [],
    comments: [],
    createdAt: new Date(),
    status: 'todo',
    name: data.name,
    description: data.description,
  };

  const boardObjId = new ObjectId(req.params.boardId);
  const result = await collections.boards().updateOne(
    {
      _id: boardObjId,
      $or: [{ userIds: userId }, { adminIds: userId }],
    },
    {
      $push: {
        tasks: task,
      },
    }
  );

  if (result.modifiedCount <= 0) {
    errorResponse(res, 'Board does not exist');
    return;
  }

  successResponse<CreateTaskResponse>(res, task);
});
