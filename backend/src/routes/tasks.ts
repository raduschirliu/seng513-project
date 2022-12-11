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
 * Comment on a task
 **************************************************/

router.post('/:taskId', async (req, res) => {
  // TODO: Finish this
  res.sendStatus(StatusCodes.NOT_IMPLEMENTED);
});

/**************************************************
 * Comment on a task
 **************************************************/

// TODO: Finish this
// TODO: Perhaps store tasks separately?

type CommentTaskRequest = {
  message: string;
};
type CommentTaskResponse = IComment;

router.post('/:boardId/tasks/:taskId/comment', async (req, res) => {
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

  if (!ObjectId.isValid(req.params.boardId)) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const comment: IComment = {
    _id: new ObjectId(),
    authorId: userId,
    message: data.message,
    timestamp: new Date(),
  };

  return res.sendStatus(StatusCodes.NOT_IMPLEMENTED);

  // const boardObjId = new ObjectId(req.params.boardId);
  // const result = await collections.boards().updateOne(
  //   {
  //     _id: boardObjId,
  //     $or: [{ userIds: userId }, { adminIds: userId }],
  //   },
  //   {
  //     $push: {
  //       tasks: task,
  //     },
  //   }
  // );

  // if (result.modifiedCount <= 0) {
  //   errorResponse(res, 'Board does not exist');
  //   return;
  // }

  // successResponse<CommentTaskResponse>(res, task);
});
