import axios from 'axios';

const API_URL = process.env['REACT_APP_API_URL'] || 'http://localhost:5000';

const createApi = (baseUrl: string) => {
  return axios.create({
    baseURL: `${API_URL}${baseUrl}`,
  });
};

export { API_URL, createApi };
