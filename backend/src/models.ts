import { WithId, Document } from 'mongodb';

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
}

export interface IChatConversation extends WithId<Document> {
  users: string[];
  messages: IChatMessage[];
}

export interface IComment extends WithId<Document> {
  author: string;
  message: string;
}

export interface ITask extends WithId<Document> {
  name: string;
  status: 'todo' | 'inprogress' | 'done';
  description: string;
  assigned: string[];
  comments: IComment[];
}

export interface IBoard extends WithId<Document> {
  name: string;
  users: string[];
  admins: string[];
  tasks: ITask[];
}
