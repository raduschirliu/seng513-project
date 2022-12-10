import Api from './api';

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
}
