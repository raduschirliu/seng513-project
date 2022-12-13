import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { errorResponse, successResponse } from '../api';
import { verifyAuthToken } from '../auth';
import { collections } from '../db';
import { IComment, ITask } from '../models';

const router = express.Router();
export default router;

/**************************************************
 * Update a task
 **************************************************/

type UpdateTaskRequest = {
  name?: string;
  assignedUserIds?: ObjectId[];
  status?: 'todo' | 'inprogress' | 'done';
  description?: string;
};
type UpdateTaskResponse = ITask;

router.patch('/:taskId', async (req, res) => {
  const data = req.body as UpdateTaskRequest;

  if (!ObjectId.isValid(req.params.taskId)) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  if (
    !data?.description &&
    !data?.name &&
    !data?.assignedUserIds &&
    !data?.status
  ) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  // Creating this to ensure the user can't inject weird properties into tasks
  const updateData: Partial<ITask> = {
    name: data?.name,
    assignedUserIds: data?.assignedUserIds,
    status: data?.status,
    description: data?.description,
  };

  let updates: { [key: string]: any } = {};

  for (const key in updateData) {
    if (updateData[key]) {
      updates[`tasks.$.${key}`] = updateData[key];
    }
  }

  const taskId = new ObjectId(req.params.taskId);
  const updateResult = await collections.boards().updateOne(
    {
      $or: [{ userIds: userId }, { adminIds: userId }],
      'tasks._id': taskId,
    },
    {
      $set: updates,
    }
  );

  if (updateResult.modifiedCount <= 0) {
    errorResponse(res, 'Task does not exist');
    return;
  }

  const result = await collections.boards().findOne({
    $or: [{ userIds: userId }, { adminIds: userId }],
    'tasks._id': taskId,
  });

  if (!result || result.tasks.length < 1) {
    console.error(
      'Something weird happened, updated task but it doesnt exist anymore...'
    );
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    return;
  }

  successResponse<UpdateTaskResponse>(res, result.tasks[0]);
});

/**************************************************
 * Comment on a task
 **************************************************/

type CommentTaskRequest = {
  message: string;
};

type CommentTaskResponse = IComment;

router.post('/:taskId/comment', async (req, res) => {
  const data = req.body as CommentTaskRequest;

  if (!data?.message) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  const comment: IComment = {
    _id: new ObjectId(),
    authorId: userId,
    message: data.message,
    timestamp: new Date(),
  };

  const taskId = new ObjectId(req.params.taskId);
  const updateResult = await collections.boards().updateOne(
    {
      $or: [{ userIds: userId }, { adminIds: userId }],
      'tasks._id': taskId,
    },
    {
      $push: {
        'tasks.$.comments': comment,
      },
    }
  );

  if (updateResult.modifiedCount <= 0) {
    errorResponse(res, 'Task does not exist');
    return;
  }

  successResponse<CommentTaskResponse>(res, comment);
});
