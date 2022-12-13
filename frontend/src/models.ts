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
  authorId: string;
  timestamp: Date;
}

export interface IChatConversation extends IMongoItem {
  users: IUser[];
  messages: IChatMessage[];
}

export interface IComment extends IMongoItem {
  authorId: string;
  message: string;
}

export interface ITask extends IMongoItem {
  name: string;
  createdBy: string;
  assignedUserIds: string[];
  status: 'todo' | 'inprogress' | 'done';
  description: string;
  comments: IComment[];
}

export interface IBoard extends IMongoItem {
  name: string;
  users: IUser[];
  tasks: ITask[];
}

export type ApiResponse<T> =
  | { success: false; error: string }
  | {
      success: true;
      data: T;
    };
