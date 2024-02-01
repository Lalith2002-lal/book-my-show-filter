async function fetchData() {
  const jsonFile = "./assets/data/movielist.json";
  try {
    const res = await fetch(jsonFile);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.status}`);
    }
    const data = await res.json();
    return data.results;
  } catch (error) {
    throw error; // Re-throw the error to indicate a failure
  }
}

let movieContainer;

// Function to get the movie cards
function getMovieCard(movie) {
  const { imageurl, imdbid, imdbrating, title, genre } = movie;
  const imageURLSrc = imageurl ? `src="${imageurl}"` : "";
  return `<div class="movie_cards_total">
        <div class="movie_cards">
          <div class="poster_ratings">
            <div class="poster">
              <img class="poster_img" ${imageURLSrc}
                alt="${imdbid}">
            </div>
            <div class="ratings">
              <p> <span class="star"> <i class="fa-solid fa-star"></i></span> ${imdbrating} / 10</p>
            </div>
          </div>
          <div class="movie_name_genres">
            <div class="movie_name">
              <h4>${title}</h4>
            </div>
            <div class="genres">
              <p>${genre}</p>
            </div>
          </div>
        </div>
        </div>`;
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  const jsonFile = "./assets/data/movielist.json";
  movieContainer = document.querySelector(".carousel");

  fetchData()
    .then((movies) => {
      movies.map((movie) => {
        const { imageurl, imdbid, imdbrating, title, genre } = movie;
        //   console.log(imdbid, title, genre, imageurl, imdbrating);
        movieContainer.innerHTML += ` 
        <div class="movie_cards_total">
        <div class="movie_cards">
          <div class="poster_ratings">
            <div class="poster">
              <img class="poster_img" src="${imageurl}"
                alt="${imdbid}">
            </div>
            <div class="ratings">
              <p> <span class="star"> <i class="fa-solid fa-star"></i></span> ${imdbrating} / 10</p>
            </div>
          </div>
          <div class="movie_name_genres">
            <div class="movie_name">
              <h4>${title}</h4>
            </div>
            <div class="genres">
              <p>${genre}</p>
            </div>
          </div>
        </div>
        </div>`;
      });
    })
    .catch((error) => {
      // Handling errors
      throw error;
    });
});

export { fetchData, getMovieCard, movieContainer };
