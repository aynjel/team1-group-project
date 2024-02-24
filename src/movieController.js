import { axiosInstance } from './movieService';

export function GetTrendingMovies(time_window, page) {
  return axiosInstance.get(`/trending/movie/${time_window}?page=${page}`);
}

export function GetMovieGenres() {
  return axiosInstance.get('/genre/movie/list');
}

export function GetMoviesByQuery(query, page) {
  return axiosInstance.get(`/search/movie?query=${query}&page=${page}`);
}

export function GetMovieDetails(movieId) {
  return axiosInstance.get(`/movie/${movieId}`);
}