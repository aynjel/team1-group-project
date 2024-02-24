import { IMAGE_URL } from './movies-api';
import { getTrendingMovies, getMovieGenres, getSearchByQuery } from './movieController';
import { getMovieDetails } from './movieModal';
import {
  refreshPagination,
  paginationContainer,
  gSelectedPage,
} from './pagination';

var movieList = document.querySelector('.movies-list');
var genreList = [];

getMovieGenres().then(response => {
  genreList.push(...response.data.genres);
});

getTrendingMovies('week').then(response => {
  var data = response.data.results;
  var movies = '';

  data.forEach(movie => {
    var genreNames = [];
    movie.genre_ids.forEach(genreId => {
      var genre = genreList.find(genre => genre.id === genreId);
      genreNames.push(genre.name);
    });

    movies += `
            <li class='movie-details' data-movie-id="${movie.id}">
                <img src="${IMAGE_URL}${movie.poster_path}" alt="${
      movie.title
    }" class="card-img" />
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <span class="movie-meta">
                        <span class="movie-genre">${genreNames.join(
                          ', '
                        )}</span> |
                        <span class="movie-release-date">${new Date(
                          movie.release_date
                        ).getFullYear()}</span>
                    </span>
                </div>
            </li>
        `;
  });
  movieList.innerHTML = movies;

  refreshPagination(data, paginationContainer, gSelectedPage);
});

// Select the form and input field
var searchForm = document.querySelector('.search-form');
var searchQuery = document.querySelector('#searchQuery');
var errorMessage = document.querySelector('.error-message');

searchForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission behavior

  var query = searchQuery.value;

  try {
    // Call the function to get search results with the search query and page number
    const data = await getSearchByQuery(query, 1);

    var dataResult = data.data.results;
    var movies = '';

    if (dataResult.length === 0) {
      // If no results found, display an error message
      displayError('Search result not successful. Enter the correct movie name and');
      return; // Exit the function early
    }

    dataResult.forEach(movie => {
      var genreNames = [];
      movie.genre_ids.forEach(genreId => {
        var genre = genreList.find(genre => genre.id === genreId);
        genreNames.push(genre.name);
      });

      movies += `
        <li class='movie-details' data-movie-id="${movie.id}">
          <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}" class="card-img" />
          <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <span class="movie-meta">
              <span class="movie-genre">${genreNames.join(', ')}</span> |
              <span class="movie-release-date">${new Date(movie.release_date).getFullYear()}</span>
            </span>
          </div>
        </li>
      `;
    });

    movieList.innerHTML = movies;
    // Handle the data as needed (e.g., render on UI)
  } catch (error) {
    console.error('Error:', error.message);
    // Handle errors (e.g., display error message to the user)
    displayError('Search result not successful. Enter the correct movie name and try again.');
  }
});

function displayError(message) {
  // Display error message on UI
  var errorMessageElement = document.createElement('p');
  errorMessageElement.textContent = message;
  errorMessageElement.style.color = 'red';
  
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

// MODAL FUNCTION START
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
