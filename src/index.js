import { IMAGE_URL, DEFAULT_IMG } from './movies-api';
import {
  GetMovieGenres,
  GetMoviesByQuery,
  GetTrendingMovies,
  GetMovieDetails,
} from './movieController';
import {
  refreshPagination,
  paginationContainer,
  gSelectedPage,
} from './pagination';
import { getMovieDetails } from './movieModal';

export let moviesQueryType = 'byTrending';
// for pagination to know which query to do
// moviesQueryType possible values : [byTrending, byQuery, byLibraryWatched, byLibraryQueue]

export let currentMovieQuery = '';
// for pagination to query text in search bar

const initialPage = 1;

var movieList = document.querySelector('.movies-list');
var movieSectionTitle = document.querySelector('.movie-section-title');
var genreList = [];
var watched = []; // for watched movies
var queue = []; // for queue movies

// Fetch genres and initial trending movies
async function fetchInitialData() {
  try {
    const genreResponse = await GetMovieGenres();
    genreList = genreResponse.data.genres;

    // Get watched and queue movies from local storage
    // watched = JSON.parse(localStorage.getItem('watched')) || [];
    // queue = JSON.parse(localStorage.getItem('queue')) || [];

    const trendingMoviesResponse = await GetTrendingMovies('week', initialPage);
    renderMovies(trendingMoviesResponse.data.results, 'byTrending');
    refreshPagination(trendingMoviesResponse.data.total_pages, paginationContainer, initialPage);
  }
  catch (error) {
    console.error('Error fetching initial data:', error);
    displayError('Error fetching initial data. Please try again later.');
  }
  finally {
    // setTimeout(() => {
    //   Notiflix.Loading.remove();
    // }, 600);
  }

}

fetchInitialData();

function renderMovies(movies, queryType) {
  if (movies.length === 0) {
    movieSectionTitle.textContent = 'No movies found';
    movieList.innerHTML = '';
    return;
  }

  moviesQueryType = queryType;
  movieSectionTitle.textContent = '';
  movieList.innerHTML = movies.map(MovieCardHTML).join('');
}

function handleSearchQuery(query) {
  if (query === '') {
    displayError('Please enter a search query');
    return;
  }

  GetMoviesByQuery(query, initialPage)
    .then(response => {
      renderMovies(response.data.results, 'byQuery');
      refreshPagination(response.data.total_pages, paginationContainer, initialPage);
    })
    .catch(error => {
      console.error('Error fetching movies by query:', error);
      displayError('Error fetching movies. Please try again later.');
    });

  // Clear previous error messages if any
  var existingErrorMessage = document.querySelector('.error-message');
  if (existingErrorMessage) {
    existingErrorMessage.remove();
  }
}

var searchForm = document.querySelector('.search-form');
var searchQuery = document.querySelector('#searchQuery');

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  currentMovieQuery = searchQuery.value;
  // console.log(currentMovieQuery);
  handleSearchQuery(currentMovieQuery);
});

// MODAL FUNCTION START
const closeModal = document.querySelector('.modal-close-btn');

const modal = document.getElementById('modal');
movieList.addEventListener('click', event => {
  const targetMovie = event.target.closest('.movie-details');
  if (targetMovie) {
    modal.classList.add('open');
    const movieId = targetMovie.getAttribute('data-movie-id');
    getMovieDetails(movieId);
  }
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('open');
});

function displayError(message) {
  // Display error message on UI
  var errorMessageElement = document.createElement('p');
  errorMessageElement.textContent = message;
  errorMessageElement.style.color = 'red';
  errorMessageElement.style.display = 'block';

  // Clear previous error messages if any
  var existingErrorMessage = document.querySelector('.error-message');
  if (existingErrorMessage) {
    existingErrorMessage.remove();
  }

  // Append new error message
  var formContainer = document.querySelector('.form-control-container');
  formContainer.appendChild(errorMessageElement);
  errorMessageElement.classList.add('error-message');
}

export function MovieCardHTML(movie) {
  var genreNames = [];
  movie.genre_ids.forEach(genreId => {
    var genre = genreList.find(genre => genre.id === genreId);
    genreNames.push(genre.name);
  });

  var movie_image = movie.poster_path
    ? `${IMAGE_URL}${movie.poster_path}`
    : DEFAULT_IMG;

  if (genreNames.length === 0) {
    genreNames.push('No genre');
  }

  return `
    <li class='movie-details' data-movie-id="${movie.id}">
      <img src="${movie_image}" alt="${movie.title}" class="card-img" />
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <span class="movie-meta">
          <span class="movie-genre">${genreNames.join(', ')}</span>
          |
          <span class="movie-release-date">${new Date(
            movie.release_date
          ).getFullYear()}</span>
        </span>
      </div>
    </li>
  `;
}
