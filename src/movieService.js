import axios from 'axios';
import { API_KEY, BASE_URL } from './movies-api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});