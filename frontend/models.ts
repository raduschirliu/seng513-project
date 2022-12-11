export interface IUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface IChatMessage {
  id: string;
  message: string;
  author: string;
}

export interface IChatConversation {
  id: string;
  users: string[];
  messages: IChatMessage[];
}

export interface IComment {
  author: IUser;
  message: string;
}

export interface ITask {
  id: string;
  name: string;
  status: 'todo' | 'inprogress' | 'done';
  description: string;
  assigned: IUser[];
  comments: IComment[];
}

export interface IBoard {
  id: string;
  name: string;
  users: string[];
  tasks: ITask[];
}
