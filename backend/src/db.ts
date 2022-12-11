import { MongoClient } from 'mongodb';
import { IBoard, IChatConversation, IUser } from './models';

export const DB_NAME = process.env['DB_NAME'] || 'dev';
const DB_URL = process.env['DB_URL'] || null;

if (!DB_URL) {
  throw new Error('DB_URL needs to be set in the environment!');
}

export const dbClient = new MongoClient(DB_URL);
export const db = dbClient.db(DB_NAME);

export enum CollectionNames {
  Conversations = 'conversations',
  Users = 'users',
  Boards = 'boards',
}

/**
 * Set of getters for accessing MongoDB collections. These are just helpers that will make sure
 * the item you get is typed correctly for TypeScript, and ensure the collection names are consistent
 */
export const collections = {
  conversations: () =>
    db.collection<IChatConversation>(CollectionNames.Conversations),
  users: () => db.collection<IUser>(CollectionNames.Users),
  boards: () => db.collection<IBoard>(CollectionNames.Boards),
};
