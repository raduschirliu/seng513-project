export interface IMongoItem {
  _id: string;
}

export interface IUser extends IMongoItem {
  username: string;
  fullName: string;
  avatarUrl: string;
}

export interface IChatMessage extends IMongoItem {
  message: string;
  author: string;
  timestamp: Date;
}

export interface IChatConversation extends IMongoItem {
  users: string[];
  messages: IChatMessage[];
}

export interface IComment extends IMongoItem {
  author: string;
  message: string;
}

export interface ITask extends IMongoItem {
  name: string;
  status: 'todo' | 'inprogress' | 'done';
  description: string;
  assigned: string[];
  comments: IComment[];
}

export interface IBoard extends IMongoItem {
  name: string;
  users: string[];
  tasks: ITask[];
}
