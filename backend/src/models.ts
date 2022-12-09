import { WithId, Document } from 'mongodb';

export interface IUser extends WithId<Document> {
  name: string;
  email: string;
  avatarUrl: string;
}

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
  tasks: ITask[];
}
