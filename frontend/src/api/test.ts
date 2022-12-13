import Api from './api';
import { ApiResponse, IBoard, ITask, IUser } from '../models';

export interface IPingResponse {
  message: string;
  yourMessage: string;
}

export class TestApi extends Api {
  constructor() {
    super('/test');
  }

  ping(message: string) {
    return this.api
      .post('/ping', { message }, { headers: this.headers })
      .catch((res) => res.data as IPingResponse);
  }

  getUserList() {
    return this.api
      .get('/list-users', { headers: this.headers })
      .catch((res) => res.data as IPingResponse);
  }
}
