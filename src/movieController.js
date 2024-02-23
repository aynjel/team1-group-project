import { Get, GetSearchByQuery } from './movieService';

export async function getTrendingMovies(time_window) {
  const response = await Get(`/trending/movie/${time_window}`);
  return response;
}

export async function getMovieGenres() {
  const response = await Get('/genre/movie/list');
  return response;
}

export async function getSearchByQuery(query, page) {
  const response = await GetSearchByQuery(query, page);
  return response;
}