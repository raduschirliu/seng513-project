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
  id: string;
  author: string;
  message: string;
}

export interface ITask {
  id: string;
  name: string;
  status: 'todo' | 'inprogress' | 'done';
  description: string;
  assigned: string[];
  comments: IComment[];
}

export interface IBoard {
  id: string;
  name: string;
  users: string[];
  tasks: ITask[];
}
