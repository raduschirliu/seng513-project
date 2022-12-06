import { MongoClient } from 'mongodb';
import { IChatConversation } from './models';

export const DB_NAME = 'seng513-project';

const CONNECTION_URI = process.env['MONGODB_URI'] || null;

if (!CONNECTION_URI) {
  throw new Error('MONGODB_URI needs to be set in the environment!');
}

export const dbClient = new MongoClient(CONNECTION_URI);
export const db = dbClient.db(DB_NAME);

export enum CollectionNames {
  Conversations = 'conversations',
}

export const collections = {
  conversations: () =>
    db.collection<IChatConversation>(CollectionNames.Conversations),
};
