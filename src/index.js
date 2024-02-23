import { IMAGE_URL } from './movies-api';
import { getTrendingMovies, getMovieGenres } from './movieController'
import { getMovieDetails } from './movieModal';

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
});

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
