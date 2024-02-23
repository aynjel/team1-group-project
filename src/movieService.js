import axios from 'axios';
import { API_KEY, BASE_URL } from './movies-api';

export function Get(url) {
  return axios.get(`${BASE_URL}${url}?api_key=${API_KEY}`);
}

export function GetSearchByQuery(query, page) {
  return axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`);
}