import axios, { Axios } from 'axios';

const API_URL = process.env['REACT_APP_API_URL'] || 'http://localhost:5000';

export default class Api {
  protected api: Axios;
  protected authToken: string | null = null;

  get headers() {
    return this.authToken
      ? {
          authorization: `Bearer ${this.authToken}`,
        }
      : {};
  }

  constructor(baseUrl: string) {
    this.api = axios.create({
      baseURL: `${API_URL}${baseUrl}`,
    });
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }
}
