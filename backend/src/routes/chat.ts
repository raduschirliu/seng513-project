import express from 'express';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { collections, db } from '../db';
import { IChatConversation, IChatMessage } from '../models';

const router = express.Router();

/* Get single conversation by ID */

type IGetConversationsByIdResponse = IChatConversation;
router.get('/conversations/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const conversationsCollection = collections.conversations();
  const conversation = await conversationsCollection.findOne({
    _id: new ObjectId(id),
  });

  // TODO: Check if user is in conversation before returning

  if (!conversation) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  return res.json(conversation as IGetConversationsByIdResponse);
});

/* Create a new conversation */

type IStartConversationRequest = {
  userIds: string[];
};
type IStartConversationResponse = IChatConversation;
router.post('/conversations', async (req, res) => {
  const reqData = req.body as IStartConversationRequest;

  if (!reqData.userIds || reqData.userIds.length < 1) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const conversationsCollection = collections.conversations();

  const conversation: IChatConversation = {
    _id: new ObjectId(),
    messages: [],
    // TODO: Add user ID of the user who requested this
    users: [...reqData.userIds],
  };

  await conversationsCollection.insertOne(conversation);
  res.json(conversation as IStartConversationResponse);
});

/* Get all conversations for a user */

type IGetAllConversationsResponse = IChatConversation[];
router.get('/conversations', async (req, res) => {
  const conversationsCollection = collections.conversations();

  // TODO: get this from auth token
  const userId = 'test-user-id';

  const cursor = conversationsCollection.find({
    users: userId,
  });

  const conversations = await cursor.toArray();
  res.json(conversations as IGetAllConversationsResponse);
});

/* Send a message in a conversation */
interface IConversationMessageRequest {
  message: string;
}
type IConversationMessageResponse = IChatMessage;
router.post('/conversations/:conversationId/message', async (req, res) => {
  const conversationId = req.params.conversationId;
  const bodyData = req.body as IConversationMessageRequest;

  if (!bodyData?.message) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  if (!ObjectId.isValid(conversationId)) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const conversationsCollection = collections.conversations();
  const conversation = await conversationsCollection.findOne({
    _id: new ObjectId(conversationId),
  });

  if (!conversation) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  // TODO: Check if user is in conversation before returning
  const userId = 'another-user';

  const message: IChatMessage = {
    _id: new ObjectId(),
    author: userId,
    message: bodyData.message,
    timestamp: new Date(),
  };

  conversationsCollection.updateOne(
    { _id: conversation._id },
    { $push: { messages: message } }
  );

  return res.json(message as IConversationMessageResponse);
});

export default router;
