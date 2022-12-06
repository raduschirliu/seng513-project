import { MongoClient } from 'mongodb';
import { IChatConversation } from './models';

export const DB_NAME = process.env['DB_NAME'] || 'dev';
const DB_URL = process.env['DB_URL'] || null;

if (!DB_URL) {
  throw new Error('DB_URL needs to be set in the environment!');
}

export const dbClient = new MongoClient(DB_URL);
export const db = dbClient.db(DB_NAME);

export enum CollectionNames {
  Conversations = 'conversations',
}

export const collections = {
  conversations: () =>
    db.collection<IChatConversation>(CollectionNames.Conversations),
};
