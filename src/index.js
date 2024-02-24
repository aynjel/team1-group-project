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
import {
  RegisterUser,
  SignInUser,
  addToWatch,
  addToQueue,
  updateUserInfoFromFirebase,
} from './userInteraction';
export let moviesQueryType = 'byTrending';
// for pagination to know which query to do
// moviesQueryType possible values : [byTrending, byQuery, byLibraryWatched, byLibraryQueue]

export let currentMovieQuery = '';
// for pagination to query text in search bar

const initialPage = 1;

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

// MODAL FUNCTION START #####################################
const closeModal = document.querySelector('.modal-close-btn');
const modal = document.getElementById('modal');
const addToWatchedBtn = document.getElementById('addToWatchedBtn');
const addToQueueBtn = document.getElementById('addToQueueBtn');
movieList.addEventListener('click', event => {
  const targetMovie = event.target.closest('.movie-details');
  if (targetMovie) {
    modal.classList.add('open');
    console.log('click');
    const movieId = targetMovie.getAttribute('data-movie-id');
    console.log(movieId);
    getMovieDetails(movieId);
    addToWatchedBtn.setAttribute('data-movie-id', movieId);
    addToQueueBtn.setAttribute('data-movie-id', movieId);
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

// FIREBASE LOGIN AND USERINERACTION  START ###############
let inputEmailRegister = document.getElementById('inputEmailRegister');
let inputPasswordRegister = document.getElementById('inputPasswordRegister');
let inputFirstName = document.getElementById('inputFirstName');
let inputLastName = document.getElementById('inputLastName');

let RegistrationForm = document.getElementById('RegistrationForm');
// let loginModal = document.getElementById('loginModal');
let SignInForm = document.getElementById('SignInForm');

RegistrationForm.addEventListener('submit', evt => {
  evt.preventDefault();

  RegisterUser(
    inputEmailRegister.value,
    inputPasswordRegister.value,
    inputFirstName.value,
    inputLastName.value
  )
    .then(() => {
      console.log('Registration successful');

      evt.target.reset();
    })
    .catch(error => {
      alert(error.message);
    });
});

SignInForm.addEventListener('submit', evt => {
  evt.preventDefault();

  SignInUser(inputEmailSignIn.value, inputPasswordSignIn.value)
    .then(() => {
      console.log('Sign-in successful');
      evt.target.reset();
      loginModal.classList.add('login-close');
    })
    .catch(error => {
      alert(error.message);
    });
});

addToWatchedBtn.addEventListener('click', addToWatch);
addToQueueBtn.addEventListener('click', addToQueue);

// window.addEventListener('beforeunload', function () {
//   sessionStorage.clear();
//   localStorage.clear();
// });
