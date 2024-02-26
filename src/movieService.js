import axios from 'axios';
import { API_KEY, BASE_URL } from './movies-api';
import Notiflix from 'notiflix';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

axiosInstance.interceptors.request.use(
  config => {
    Notiflix.Loading.pulse();
    return config;
  },
  error => {
    Notiflix.Loading.failure();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    Notiflix.Loading.remove();
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);
