export const apiKey = "2103b891";
export const baseUrl = `https://www.omdbapi.com/?apikey=${apiKey}&`;

let searchResults = [];
const myWatchlist = JSON.parse(localStorage.getItem("watchlist"));
export let watchlist = myWatchlist;

const searchValue = document.getElementById("searchBar");
const searchForm = document.getElementById("searchForm");
const moviesList = document.getElementById("movies-list");

async function getMovies(searchKey) {
  if (searchKey.length > 2) {
    moviesList.innerHTML = `
    
    <div class="explore loading"><img class="spinner" src="./imgs/tube-spinner.svg">Loading...</div>
    `;
    const res = await fetch(`${baseUrl}s=${searchKey}`);
    const data = await res.json();

    if (res.ok && data.Response === "True") {
      searchResults = data.Search;
      mapMovies(data.Search);
    }

    if (data.Response === "False") {
      noData();
    }
  }
}

function noData() {
  moviesList.innerHTML = `<div class="explore">Unable to find what you’re looking for. Please try another search.</div>`;
}

async function mapMovies(movies) {
  const movieDetails = await Promise.all(
    movies.map((movie) => getDetails(movie.imdbID))
  );

  const cardHTML = movieDetails.map((movie) => filmHTML(movie)).join("");

  moviesList.innerHTML = `${cardHTML}`;
}

async function getDetails(imdbID) {
  const res = await fetch(`${baseUrl}i=${imdbID}`);
  const data = await res.json();
  return data;
}

export function filmHTML(movie) {
  return `
        <div class='movie'>
        <img src="${
          movie.Poster.length > 3 ? movie.Poster : "./imgs/placeholder.jpg"
        }">
        <div class="movie-details">
            <div class="movie-header">
                <h3 class="movie-title">${movie.Title}</h3>
                <div class="movie-rating"><img class="rating-star" src="/imgs/rating-icon.svg">${
                  movie.Ratings.length !== 0
                    ? movie.Ratings[0].Value.replace("/10", "")
                    : ""
                }</div>
            </div>
            <div class="movie-data">
                <span>${movie.Runtime}</span>
                <span>${movie.Genre}</span>
                <button data-id="${
                  movie.imdbID
                }" class="watchlistAdd"><span class="plus-icon">${
    watchlist.includes(movie.imdbID)
      ? "&minus;</span> Remove"
      : "&plus;</span> Watchlist"
  }</button>
            </div>
            <p>${movie.Plot}</p>
        </div>
    </div>
    `;
}

document.addEventListener("click", (e) => {
  if (e.target.className === "watchlistAdd") {
    if (watchlist.includes(e.target.dataset.id)) {
      watchlist.splice(watchlist.indexOf(e.target.dataset.id), 1);
    } else {
      watchlist.push(e.target.dataset.id);
    }
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    mapMovies(searchResults);
  }
});

searchForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  getMovies(searchValue.value);
});
