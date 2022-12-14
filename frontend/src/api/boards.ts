import { ApiResponse, IBoard, ITask, IUser } from '../models';
import Api from './api';

export class BoardsApi extends Api {
  constructor() {
    super('/boards');
  }

  getAll(): Promise<ApiResponse<IBoard[]>> {
    return this.api
      .get('/', {
        headers: this.headers,
      })
      .then((res) => res.data);
  }

  get(boardId: string): Promise<ApiResponse<IBoard>> {
    return this.api
      .get(`/${boardId}`, {
        headers: this.headers,
      })
      .then((res) => res.data);
  }

  createTask(
    boardId: string,
    task: Partial<ITask>
  ): Promise<ApiResponse<ITask>> {
    return this.api
      .post(`/${boardId}/tasks`, task, { headers: this.headers })
      .then((res) => res.data);
  }

  createBoard(name: string): Promise<ApiResponse<IBoard>> {
    return this.api
      .post(
        '/create',
        {
          name,
        },
        { headers: this.headers }
      )
      .then((res) => res.data);
  }

  join(boardId: string): Promise<ApiResponse<{}>> {
    return this.api
      .post(`/${boardId}/join`, {}, { headers: this.headers })
      .then((res) => res.data);
  }

  yourTasks(boardId: string): Promise<ApiResponse<ITask>> {
    return this.api
      .get(`/${boardId}/your-tasks`, {
        headers: this.headers,
      })
      .then((res) => res.data);
  }

  yourCreatedTasks(boardId: string): Promise<ApiResponse<ITask>> {
    return this.api
      .get(`/${boardId}/your-created-tasks`, {
        headers: this.headers,
      })
      .then((res) => res.data);
  }

  userList(boardId: string): Promise<ApiResponse<IUser>> {
    return (
      this.api
        //.get(`/${boardId}/list-users`,{
        //  headers: this.headers,
        //}).then((res) => res.data);
        .get('/list-users', {
          headers: this.headers,
        })
        .then((res) => res.data)
    );
  }
}
