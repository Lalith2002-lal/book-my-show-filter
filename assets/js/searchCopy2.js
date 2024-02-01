import { fetchData, getMovieCard, movieContainer } from "./index.js";

window.addEventListener("load", async function () {
  const searchInput = document.getElementById("search");
  console.log(searchInput);
  const suggestBox = document.querySelector(".suggest-box");
  const genreSelect = document.getElementById("genres");
  let movies = [];

  //******************************Small functions************************************//
  // Function to disappear the suggestion when the esc key is pressed
  searchInput.addEventListener("keyup", function (e) {
    console.log("Key pressed", e.key);
    if (e.key === "Escape") {
      displayAllData();
      suggestBox.innerHTML = "";
    }
  });
  // Function to disappear when the mouse click outside of the search bar
  document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !suggestBox.contains(e.target)) {
      suggestBox.innerHTML = "";
      displayAllData();
    }
  });
  // Event for the input total selection
  searchInput.addEventListener("click", () => {
    searchInput.select();
  });

  // Function to create the new array and store the genres on that
  function mergeArraysWithFiltered(...arrays) {
    const arrayOfArrays = [].concat(...arrays);
    const filteredArray = arrayOfArrays.filter(
      (value, index) => arrayOfArrays.indexOf(value) === index
    );
    return filteredArray;
  }
  //******************************Small functions ends************************************//
  try {
    const data = await fetchData();
    movies = data.map((movie) => {
      const { imageurl, imdbid, imdbrating, title, genre } = movie;
      return {
        imageurl,
        imdbid,
        imdbrating,
        title: title.toLowerCase(),
        genre,
      };
    });
    searchInput.addEventListener("input", function (e) {
      const value = e.target.value.toLowerCase();

      const filteredMovie = movies.filter((movie) => {
        return movie.title.toLowerCase().includes(value);
      });

      // console.log(filteredMovie);
    });
    // console.log(movies);
    searchInput.addEventListener("keyup", filterSuggestion);
  } catch (error) {
    console.error("Error on Fetching", error);
  }

  // Function for the search suggestion
  function filterSuggestion() {
    let input = this.value.trim();
    const keywordList = movies.map((movie) => movie.title.toLowerCase());
    let suggest = [];
    if (input.length) {
      suggest = keywordList.filter((movie) => {
        return movie.includes(input.toLowerCase().trim());
      });
      display(suggest);
      console.log("suggest", suggest);
      // // Function to display the movie card while searching
      const movieCards = movies
        .filter((movie) => suggest.includes(movie.title.toLowerCase()))
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
      displayAllData();
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
      displayMovieCards(e.target.innerText.trim().toLowerCase());
    }
  });

  // Function to display all the data when
  function displayAllData() {
    const allMovies = movies.map((movie) => getMovieCard(movie));
    movieContainer.innerHTML = allMovies.join("");
  }
  function displayMovieCards(moviesToDisplay) {
    const movieCards = moviesToDisplay.map((movie) => getMovieCard(movie));

    if (movieCards.length > 0) {
      movieContainer.innerHTML = movieCards.join("");
    } else {
      movieContainer.innerHTML = "MOVIE NOT FOUND.";
    }
  }

  const generesArray = movies.map((movie) => movie.genre);
  console.log(generesArray);
  const uniqueGenres = mergeArraysWithFiltered(...generesArray);
  // console.log(uniqueGenres);
  // Initiate the option with unique Genres to the select option
  uniqueGenres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.toLowerCase();
    option.textContent = genre;
    genreSelect.appendChild(option);
  });

  function filterByGenre(selectedGenre) {
    const filteredMovie = movies.filter((movie) => {
      return movie.genre.some(
        (genre) => genre.toLowerCase() === selectedGenre.toLowerCase()
      );
    });
    return filteredMovie;
  }

  genreSelect.addEventListener("change", function () {
    const selectedGenre = this.value.toLowerCase();
    console.log(selectedGenre);
    const filteredMovie = filterByGenre(selectedGenre);

    if (filteredMovie.length > 0) {
      const movieCards = filteredMovie.map((movie) => getMovieCard(movie));
      movieContainer.innerHTML = movieCards.join("");
    } else {
      movieContainer.innerHTML = "NO MOVIE GENRE FOUND";
    }
    console.log(filteredMovie);
  });
});
