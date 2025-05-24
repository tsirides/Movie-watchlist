import { watchlist, baseUrl, filmHTML } from "../index.js";

const moviesWatchlist = document.getElementById("movies-list");

window.onload = () => {
  if (watchlist.length > 0) {
    //renderMovies(watchlist);
    renderMovies(watchlist);
  }
};

async function getMovies(imdbId) {
  const res = await fetch(`${baseUrl}i=${imdbId}`);
  const data = await res.json();
  return data;
}

async function renderMovies(movies) {
  const movieDetails = await Promise.all(
    movies.map((movie) => getMovies(movie))
  );

  const cardHTML = movieDetails.map((movie) => watchlistHTML(movie)).join("");
  if (watchlist.length > 0) {
    moviesWatchlist.innerHTML = `${cardHTML}`;
  } else {
    moviesWatchlist.innerHTML = `
  <div class="explore">
        <p>Your watchlist is looking a little empty...</p>
        <a href="/"
          ><span class="plus-icon">&plus;</span> Let's add some movies</a
        >
  `;
  }
}

export function watchlistHTML(movie) {
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
                }" class="watchlistRemove"><span data-id="${
    movie.imdbID
  }" class="plus-icon">&minus;</span>Remove</button>
            </div>
            <p>${movie.Plot}</p>
        </div>
    </div>
    `;
}

document.addEventListener("click", (e) => {
  if (e.target.className === "watchlistRemove") {
    console.log("check");
    if (watchlist.includes(e.target.dataset.id)) {
      watchlist.splice(watchlist.indexOf(e.target.dataset.id), 1);
    } else {
      watchlist.push(e.target.dataset.id);
    }
    renderMovies(watchlist);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }
});
