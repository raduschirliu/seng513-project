import { ApiResponse, IBoard } from '../models';
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

  create(name: string): Promise<ApiResponse<IBoard>> {
    return this.api
      .post(
        '/',
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
}
