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

var authModal = document.getElementById('loginModal');
var tabAuth = document.getElementById('tab-auth');
var tabLibrary = document.getElementById('tab-library');

const userData = JSON.parse(sessionStorage.getItem('user-credentials'));
if (userData) {
  console.log('User Info:', userData);
  authModal.style.display = 'none';
  tabAuth.style.display = 'none';
  tabLibrary.style.display = 'block';
  updateUserInfoFromFirebase();
}

export let currentMovieQuery = '';
// for pagination to query text in search bar

const initialPage = 1;

var movieList = document.querySelector('.movies-list');
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
    displayError('Search result not successful. Enter the correct movie name and');
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
    movieSectionTitle.textContent = 'Search result not successful. Enter the correct movie name and';
    movieList.innerHTML = '';
    return;
  }

  moviesQueryType = queryType;
  movieList.innerHTML = movies.map(MovieCardHTML).join('');
}

function handleSearchQuery(query) {
  if (query === '') {
    displayError('Search result not successful. Enter the correct movie name and');
    return;
  }

  GetMoviesByQuery(query, initialPage)
    .then(response => {
      renderMovies(response.data.results, 'byQuery');
      refreshPagination(response.data.total_pages, paginationContainer, initialPage);
    })
    .catch(error => {
      console.error('Error fetching movies by query:', error);
      displayError('Search result not successful. Enter the correct movie name and.');
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

var registerClose = document.querySelectorAll('.register-close');
var registerOpen = document.querySelectorAll('.register-open');
var loginOpen = document.querySelectorAll('.login-open');

var loginModal = document.getElementById('SignInForm');
var registerModal = document.getElementById('RegistrationForm');

registerOpen.forEach((btn) => {
  btn.addEventListener('click', () => {
    registerModal.style.display = 'flex';
    loginModal.style.display = 'none';
  });
});

registerClose.forEach((btn) => {
  btn.addEventListener('click', () => {
    registerModal.style.display = 'none';
    authModal.style.display = 'none';
  });
});

loginOpen.forEach((btn) => {
  btn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
    registerModal.style.display = 'none';
  });
});

tabAuth.addEventListener('click', () => {
  authModal.style.display = 'flex';
  loginModal.style.display = 'flex';
  registerModal.style.display = 'none';
});