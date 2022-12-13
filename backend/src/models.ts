import { WithId, Document, ObjectId } from 'mongodb';

export interface IUser extends WithId<Document> {
  username: string;
  passwordHash?: string;

  fullName: string;
  avatarUrl: string;
}

export type ISanitizedUser = Omit<IUser, 'passwordHash'>;

export interface IChatMessage extends WithId<Document> {
  message: string;
  author: string;
  timestamp: Date;
}

export interface IChatConversation extends WithId<Document> {
  users: string[];
  messages: IChatMessage[];
}

export interface IComment extends WithId<Document> {
  authorId: ObjectId;
  message: string;
  timestamp: Date;
}

export interface ITask extends WithId<Document> {
  name: string;
  createdBy: ObjectId;
  assignedUserIds: ObjectId[];
  status: 'todo' | 'inprogress' | 'done';
  description: string;
  comments: IComment[];
  createdAt: Date;
}

export interface IBoard extends WithId<Document> {
  name: string;
  userIds: ObjectId[];
  adminIds: ObjectId[];
  tasks: ITask[];
}
