import { fetchData, getMovieCard, movieContainer } from "./index.js";

window.addEventListener("load", async function () {
  const searchInput = document.getElementById("search");
  console.log(searchInput);
  const suggestBox = document.querySelector(".suggest-box");
  let movies = [];

  // Event for the input total selection
  searchInput.addEventListener("click", () => {
    searchInput.select();
  });

  try {
    const data = await fetchData();
    movies = data.map((movie) => {
      const { title } = movie;
      return { movieName: title };
    });
    searchInput.addEventListener("input", function (e) {
      const value = e.target.value.toLowerCase();

      const filteredMovie = movies.filter((movie) => {
        return movie.movieName.toLowerCase().includes(value);
      });

      // console.log(filteredMovie);
    });

    searchInput.addEventListener("keyup", filterSuggestion);
  } catch (error) {
    console.error("Error on Fetching", error);
  }

  // Function for the search suggestion
  function filterSuggestion() {
    let input = this.value.trim();
    const keywordList = movies.map((movie) => movie.movieName.toLowerCase());
    let suggest = [];
    if (input.length) {
      suggest = keywordList.filter((movie) => {
        return movie.toLowerCase().includes(input);
      });
      display(suggest);
      console.log("suggest", suggest);
      // // Function to display the movie card while searching
      const movieCards = movies
        .filter((movie) => suggest.includes(movie.movieName.toLowerCase()))
        .map((filteredMovie) => getMovieCard(filteredMovie));
      console.log("movie-Cards", movieCards);
      // Function to display the search empty when the search is mismatch
      // if (!suggest.length) {
      //   suggestBox.innerHTML = "";
      // }
      if (movieCards.length > 0) {
        movieContainer.innerHTML = movieCards.join("");
      } else {
        movieContainer.innerHTML = "MOVIE NOT FOUND.";
      }
    } else {
      movieContainer.innerHTML = "";
    }
  }

  // Function to clear the auto suggestion and auto fill the search
  function selectInput(list) {
    searchInput.value = list.innerHTML;
    suggestBox.innerHTML = "";
  }

  function display(suggest) {
    const content = suggest.map((list) => {
      return `<li >${list}</li>`;
    });
    suggestBox.innerHTML = `<ul>${content.join("")}</ul>`;
  }

  // Event Listeners for handling the li clicks
  suggestBox.addEventListener("click", function (e) {
    if (e.target.tagName.toLowerCase() === "li") {
      selectInput(e.target);
    }
  });
});
