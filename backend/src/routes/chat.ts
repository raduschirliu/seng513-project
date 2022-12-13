import express from 'express';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { errorResponse, successResponse } from '../api';
import { verifyAuthToken } from '../auth';
import { CollectionNames, collections } from '../db';
import { IChatConversation, IChatMessage, ISanitizedUser } from '../models';

const router = express.Router();
export default router;

type IAggregatedConversation = Omit<IChatConversation, 'userIds'> & {
  users: ISanitizedUser[];
};

async function getAggregatedConversations(
  userId: ObjectId,
  conversationId: ObjectId | null
): Promise<IAggregatedConversation[]> {
  const cursor = collections.conversations().aggregate();

  // Only match conversations you are in
  cursor.match({
    userIds: userId,
  });

  // Only match a board with ID if specified
  if (conversationId) {
    cursor.match({
      _id: conversationId,
    });
  }

  // Lookup users from userId
  cursor.lookup({
    from: CollectionNames.Users,
    localField: 'userIds',
    foreignField: '_id',
    as: 'users',
  });

  // Remove fields for user/admin IDs, and user sensitive info
  cursor.project({
    userIds: 0,
    'users.passwordHash': 0,
  });

  const conversations = (await cursor.toArray()) as IAggregatedConversation[];
  return conversations;
}

/**************************************************
 * Get a single conversation by ID
 **************************************************/

type GetConversationsByIdResponse = IAggregatedConversation;

router.get('/conversations/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  const conversationId = new ObjectId(id);
  const conversations = await getAggregatedConversations(
    userId,
    conversationId
  );

  if (conversations.length < 1) {
    errorResponse(res, 'Conversation does not exist');
    return;
  }

  successResponse<GetConversationsByIdResponse>(res, conversations[0]);
});

/**************************************************
 * Create a new conversation
 **************************************************/

type StartConversationRequest = {
  userIds: string[];
};

type StartConversationResponse = IAggregatedConversation;

router.post('/conversations', async (req, res) => {
  const reqData = req.body as StartConversationRequest;

  if (!reqData.userIds || reqData.userIds.length < 1) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  let userIds: ObjectId[] = [];

  try {
    userIds = reqData.userIds.map((id) => {
      return new ObjectId(id);
    });
  } catch (err) {
    console.error('Error converting userIds to strings: ', err);
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  // Add user who requested the chat
  userIds.push(userId);

  const conversation: IChatConversation = {
    _id: new ObjectId(),
    messages: [],
    userIds: userIds,
  };

  await collections.conversations().insertOne(conversation);

  // Request the conversation again to aggregate all users
  const conversations = await getAggregatedConversations(
    userId,
    conversation._id
  );

  if (conversations.length < 1) {
    errorResponse(res, 'Conversation does not exist');
    return;
  }

  successResponse<StartConversationResponse>(res, conversations[0]);
});

/**************************************************
 * Get all conversations a user is in
 **************************************************/

type GetAllConversationsResponse = IAggregatedConversation[];

router.get('/conversations', async (req, res) => {
  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  const conversations = await getAggregatedConversations(userId, null);
  successResponse<GetAllConversationsResponse>(res, conversations);
});

/**************************************************
 * Send a message in a conversation
 **************************************************/

type ConversationMessageRequest = {
  message: string;
};

type ConversationMessageResponse = IChatMessage;

router.post('/conversations/:conversationId/message', async (req, res) => {
  const conversationId = req.params.conversationId;
  const bodyData = req.body as ConversationMessageRequest;

  if (!bodyData?.message) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  if (!ObjectId.isValid(conversationId)) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  const userId = verifyAuthToken(req);
  if (!userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  const message: IChatMessage = {
    _id: new ObjectId(),
    authorId: userId,
    message: bodyData.message,
    timestamp: new Date(),
  };

  const result = await collections
    .conversations()
    .updateOne(
      { _id: new ObjectId(conversationId), userIds: userId },
      { $push: { messages: message } }
    );

  if (result.modifiedCount < 1) {
    errorResponse(res, 'Conversation does not exist');
    return;
  }

  successResponse<ConversationMessageResponse>(res, message);
});
