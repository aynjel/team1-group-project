import { GetMovieDetails } from './movieController';
import { IMAGE_URL, DEFAULT_IMG } from './movies-api';

export async function getMovieDetails(movieId) {
  const { data } = await GetMovieDetails(movieId);
  updateModal(data);
  console.log(data);
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

  modalMovieGenre.innerText = genres.map(genre => genre.name).join(', ');
  modalMovieVote.innerText = `${vote_average} / ${vote_count}`;
  modalMovieImage.src = poster_path ? `${IMAGE_URL}${poster_path}` : DEFAULT_IMG;
  modalMovieTitle.innerText = `${title}`;
  modalMoviePopularity.innerText = `${popularity}`;
  modalMovieOriginalTitle.innerText = `${original_title}`;
  modalMovieAbout.innerText = `${overview}`;
}
