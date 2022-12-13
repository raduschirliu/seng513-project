import { ApiResponse, IComment, ITask } from '../models';
import Api from './api';

export class TasksApi extends Api {
  constructor() {
    super('/tasks');
  }

  update(taskId: string, updates: Partial<ITask>): Promise<ApiResponse<ITask>> {
    return this.api.patch(
      `/${taskId}`,
      { ...updates },
      { headers: this.headers }
    );
  }

  comment(taskId: string, message: string): Promise<ApiResponse<IComment>> {
    return this.api
      .post(
        `/${taskId}/comment`,
        {
          message,
        },
        { headers: this.headers }
      )
      .then((res) => res.data);
  }
}
