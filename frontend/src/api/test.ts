import { createApi } from './baseApi';

const api = createApi('/test');

export interface IPingResponse {
  message: string;
  yourMessage: string;
}

function ping(message: string) {
  return api
    .post('/ping', { message })
    .then((res) => res.data as IPingResponse);
}

export { ping };
