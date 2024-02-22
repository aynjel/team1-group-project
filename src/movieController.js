import { Get } from './movieService';

export async function getTrendingMovies(time_window) {
  const response = await Get(`/trending/movie/${time_window}`);
  return response;
}

export async function getMovieGenres() {
  const response = await Get('/genre/movie/list');
  return response;
}
