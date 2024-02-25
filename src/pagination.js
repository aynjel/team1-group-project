import { IMAGE_URL, DEFAULT_IMG } from './movies-api';
import {
  GetMovieGenres,
  GetMoviesByQuery,
  GetTrendingMovies,
  GetMovieDetails,
} from './movieController';
import { getMovieDetails } from './movieModal';
import { MovieCardHTML, moviesQueryType, currentMovieQuery } from './index';

// ###############################################################
// Variable Declarations and Assignments
// ###############################################################
const movieList = document.querySelector('#movies-list');
export const paginationContainer = document.querySelector('#pagination');
export let gSelectedPage = 1;
let gItemsPerPage = 20;
const paginateChoices = 5; // pages to show before cutting

//
//
// ###############################################################
// Functions
// ###############################################################

export function refreshPagination(totalPages, pagination, pageSelected) {
  if (totalPages > 500) {
    gTotalPages = 500;
  } else {
    gTotalPages = totalPages;
  }

  let pagesToDisplay = [];
  const paginateGroup = Math.ceil(pageSelected / paginateChoices);
  let pageDots = 1;

  choosePagesToDisplay(pagesToDisplay, gTotalPages, pageSelected);

  if (pageSelected != 1) {
    pagesToDisplay.unshift(`<`);
  }
  if (pageSelected != gTotalPages) {
    pagesToDisplay.push(`>`);
  }

  pagination.innerHTML = '';

  pagesToDisplay.forEach(page => {
    let liElement = document.createElement('li');
    let linkElement = document.createElement('a');
    linkElement.href = '#';
    linkElement.textContent = page;
    linkElement.className = 'page-choice';

    if (page == '...' && pageDots == 2) {
      linkElement.dataset.group = paginateGroup + 1;
    }

    if (page == '...' && pageDots == 1 && paginateGroup == 1) {
      linkElement.dataset.group = paginateGroup + 1;
    }

    if (page == '...' && pageDots == 1 && paginateGroup > 1) {
      linkElement.dataset.group = paginateGroup - 1;
      pageDots++;
    }

    if (page == pageSelected) {
      liElement.classList.add('active');
    }

    liElement.appendChild(linkElement);
    pagination.appendChild(liElement);

    if (
      !(page == '<' && pageSelected == 1) &&
      !(page == '>' && pageSelected == gTotalPages)
    ) {
      linkElement.addEventListener('click', clickedPage);
    }
  });
}

function choosePagesToDisplay(pagesToDisplay, totalPages, pageSelected) {
  const paginateGroup = Math.ceil(pageSelected / paginateChoices);
  const paginateGroupMax = Math.ceil(totalPages / paginateChoices);

  if (totalPages <= paginateChoices || totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) {
      pagesToDisplay.push(i);
    }
  } else if (paginateGroup == 1) {
    for (let i = 1; i <= paginateChoices; i++) {
      pagesToDisplay.push(i);
    }
    pagesToDisplay.push('...');
    pagesToDisplay.push(totalPages);
  } else {
    pagesToDisplay.push(`1`);
    pagesToDisplay.push(`...`);
    for (
      let i = paginateChoices * (paginateGroup - 1) + 1;
      i <= paginateChoices * paginateGroup;
      i++
    ) {
      if (i <= totalPages) {
        pagesToDisplay.push(i);
      }
    }
    if (paginateGroup != paginateGroupMax) {
      pagesToDisplay.push(`...`);
      pagesToDisplay.push(totalPages);
    }
  }
}

function clickedPage(event) {
  const selected = event.target.innerHTML;

  if (selected == '&lt;') {
    gSelectedPage--;
  } else if (selected == '&gt;') {
    gSelectedPage++;
  } else {
    gSelectedPage = selected;
  }

  if (selected == '...') {
    gSelectedPage = (event.currentTarget.dataset.group - 1) * 5 + 1;
  }

  if (moviesQueryType == 'byTrending') {
    fetchTrending();
  }
  if (moviesQueryType == 'byQuery') {
    fetchByQuery();
  }
  if (moviesQueryType == 'byLibraryWatched') {
    fetchByWatched();
  }
  if (moviesQueryType == 'byLibraryQueue') {
    fetchByQueue();
  }

  refreshPagination(gTotalPages, paginationContainer, gSelectedPage);
}

function fetchTrending() {
  GetTrendingMovies('week', gSelectedPage).then(response => {
    var movies = '';
    response.data.results.forEach(movie => {
      movies += MovieCardHTML(movie);
    });

    movieList.innerHTML = movies;

    refreshPagination(gTotalPages, paginationContainer, gSelectedPage);
  });
}

function fetchByQuery() {
  // console.log(`from byQuery`, currentMovieQuery, `page: `, gSelectedPage);
  GetMoviesByQuery(currentMovieQuery, gSelectedPage).then(response => {
    if (response.data.results.length === 0) {
      displayError('No movie found');
      return;
    }

    var movies = '';
    response.data.results.forEach(movie => {
      movies += MovieCardHTML(movie);
    });

    movieList.innerHTML = movies;
    refreshPagination(gTotalPages, paginationContainer, gSelectedPage);
  });
}

function fetchByWatched() {
  // Query for watched movies

  refreshPagination(gTotalPages, paginationContainer, gSelectedPage);
}

function fetchByQueue() {
  // Query for queued movies

  refreshPagination(gTotalPages, paginationContainer, gSelectedPage);
}
