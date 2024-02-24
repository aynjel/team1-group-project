import { Get } from './movieService';
import { IMAGE_URL } from './movies-api';

export async function getMovieDetails(movieId) {
  const response = await Get(`/movie/${movieId}`);
  const data = response.data;
  console.log(data);
  updateModal(data);
  return data;
}

const modalMovieImage = document.getElementById('modalImage');
const modalMovieTitle = document.getElementById('modalMovieTitle');
const modalMovieVote = document.getElementById('modalMovieVote');
const modalMoviePopularity = document.getElementById('modalMoviePopularity');
const modalMovieOriginalTitle = document.getElementById(
  'modalMovieOriginalTitle'
);
const modalMovieGenre = document.getElementById('modalMovieGenre');
const modalMovieAbout = document.getElementById('modalMovieAbout');
const modalMovieVoteAverage = document.getElementById('modalMovieVoteAverage');

function updateModal(data) {
  const {
    poster_path,
    genres,
    title,
    original_title,
    vote_count,
    vote_average,
    overview,
    popularity,
  } = data;

  let averageround = parseFloat(vote_average).toFixed(1);
  let popularityround = parseFloat(popularity).toFixed(1);

  modalMovieGenre.innerText = genres.map(genre => genre.name).join(', ');
  modalMovieImage.src = `${IMAGE_URL}${poster_path}`;
  modalMovieVoteAverage.innerHTML = `${averageround} `;
  modalMovieVote.innerText = `/ ${vote_count}`;
  modalMovieTitle.innerText = `${title}`;
  modalMoviePopularity.innerText = `${popularityround}`;
  modalMovieOriginalTitle.innerText = `${original_title}`;
  modalMovieAbout.innerText = `${overview}`;
}
