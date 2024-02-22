import { IMAGE_URL } from "./movies-api";
import { getTrendingMovies, getMovieGenres } from "./movieController";

var movieList = document.querySelector('.movies-list');
var genreList = [];

getMovieGenres().then((response) => {
    genreList.push(...response.data.genres);
});

getTrendingMovies('week').then((response) => {
    var data = response.data.results;
    var movies = '';

    data.forEach(movie => {
        var genreNames = [];
        movie.genre_ids.forEach(genreId => {
            var genre = genreList.find(genre => genre.id === genreId);
            genreNames.push(genre.name);
        });
        
        movies += `
            <li class='movie-details'>
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
});