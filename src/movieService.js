import axios from 'axios';
import { API_KEY, BASE_URL } from './movies-api';

export function Get(url) {
  return axios.get(`${BASE_URL}${url}?api_key=${API_KEY}`);
}
