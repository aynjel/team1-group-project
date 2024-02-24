import { IMAGE_URL } from './movies-api';
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

var movieList = document.querySelector('.movies-list');
var genreList = [];

var watched = []; // for watched movies
var queue = []; // for queue movies

GetMovieGenres().then(response => genreList.push(...response.data.genres));

GetTrendingMovies('week', initialPage).then(response => {
  moviesQueryType = 'byTrending';
  var movies = '';
  response.data.results.forEach(movie => {
    movies += MovieCardHTML(movie);
  });

  movieList.innerHTML = movies;
  refreshPagination(
    response.data.total_pages,
    paginationContainer,
    initialPage
  );
});

GetMovieDetails(365620).then(response => {
  // console.log(response.data);
});

var searchForm = document.querySelector('.search-form');
var searchQuery = document.querySelector('#searchQuery');
var errorMessage = document.querySelector('.error-message');

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  console.log('searching');
  var query = searchQuery.value.trim();
  if (query === '') {
    displayError(
      'Search result not successful. Enter the correct movie name and'
    );
    return;
  }

  currentMovieQuery = query;

  GetMoviesByQuery(query, initialPage).then(response => {
    moviesQueryType = 'byQuery';
    if (response.data.results.length === 0) {
      displayError(
        'Search result not successful. Enter the correct movie name and'
      );
      return;
    }

    var movies = '';
    response.data.results.forEach(movie => {
      movies += MovieCardHTML(movie);
    });

    movieList.innerHTML = movies;
    refreshPagination(
      response.data.total_pages,
      paginationContainer,
      initialPage
    );
  });
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
  errorMessageElement.style.textAlign = 'center';
  errorMessageElement.style.paddingTop = '22px';

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

// MODAL FUNCTION START #####################################
const closeModal = document.querySelector('.modal-close-btn');
const modal = document.getElementById('modal');
movieList.addEventListener('click', event => {
  const targetMovie = event.target.closest('.movie-details');
  if (targetMovie) {
    modal.classList.add('open');
    console.log('click');
    const movieId = targetMovie.getAttribute('data-movie-id');
    console.log(movieId);
    getMovieDetails(movieId);
  }
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('open');
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    modal.classList.remove('open');
  }
});

modal.addEventListener('click', function (event) {
  if (!event.target.closest('.moviecard-modal-content')) {
    modal.classList.remove('open');
  }
});
// MODAL FUNCTION END #####################################
