import { fetchData, getMovieCard, movieContainer } from "./index.js";

const mainFunction = async function () {
  const searchInput = document.getElementById("search");
  const suggestBox = document.querySelector(".suggest-box");
  const genreSelect = document.getElementById("genres");
  const ratingSelect = document.getElementById("ratings");
  let movies = [];
  console.log(ratingSelect);
  //******************************Small functions************************************//
  // Function to disappear the suggestion when the esc key is pressed
  // searchInput.addEventListener("keyup", function (e) {

  // });
  // Function to display all data when the esc button is pressed

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
    if (!data || !Array.isArray(data)) {
      console.error("Invalid data format:", data);
      return;
    }
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

    // Display all of the data to the page initially
    displayAllData();

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
  function filterSuggestion(e) {
    if (movies.length === 0) {
      console.log("Movies array is empty. Waiting for the data");
      return;
    }

    if (e.key === "Escape") {
      clearSuggestion();
      displayAllData();
      return;
    }

    let input = this.value.trim();
    const keywordList = movies.map((movie) => movie.title.toLowerCase());
    let suggest = [];

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
  }
  // Function to clear the auto suggestion and auto fill the search
  function selectInput(selectedMovie) {
    searchInput.value = selectedMovie;
    displayMovieCards(selectedMovie);
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
      let selectedMovie = e.target.innerText.trim().toLowerCase();
      console.log(selectedMovie);
      selectInput(selectedMovie);
    }
  });

  // Function to display all the data when searching

  function clearSuggestion() {
    suggestBox.innerHTML = "";
    displayAllData();
  }

  function displayAllData() {
    const allMovies = movies.map((movie) => getMovieCard(movie));
    movieContainer.innerHTML = allMovies.join("");
  }

  function displayMovieCards(moviesToDisplay) {
    console.log("displayAll Movie is called");
    const filteredMovie = movies.filter(
      (movie) =>
        movie.title.trim().toLowerCase() ===
        moviesToDisplay.trim().toLowerCase()
    );
    if (filteredMovie.length > 0) {
      const movieCard = filteredMovie.map((movie) => getMovieCard(movie));
      movieContainer.innerHTML = movieCard.join("");
    } else {
      movieContainer.innerHTML = "MOVIE NOT FOUND";
    }
    // const movieCards = moviesToDisplay.map((movie) => getMovieCard(movie));

    // if (movieCards.length > 0) {
    //   movieContainer.innerHTML = movieCards.join("");
    // } else {
    //   movieContainer.innerHTML = "MOVIE NOT FOUND.";
    // }
  }

  // For the search by genre wise
  const generesArray = movies.map((movie) => movie.genre);
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
  });

  // For the search by rating wise

  const totalRating = movies.map((movie) => Math.ceil(movie.imdbrating));
  console.log(totalRating);

  ratingSelect.addEventListener("change", function () {
    const selectedRating = this.value;
    filterByRatings(selectedRating);
  });

  function filterByRatings(selectedRating) {
    if (selectedRating === "") {
      displayAllData();
      return;
    }

    const [minRating, maxRating] = selectedRating.split("-").map(Number);

    const filteredRating = movies.filter((movie) => {
      const movieRating = Math.ceil(movie.imdbrating);
      return movieRating >= minRating && movieRating < maxRating;
    });

    if (filteredRating.length > 0) {
      const movieCards = filteredRating.map((movie) => getMovieCard(movie));
      movieContainer.innerHTML = movieCards.join("");
    } else {
      movieContainer.innerHTML = "NO MOVIES FOUND FOR THE SELECTED RATING";
    }

    console.log("Min Rating ", minRating);
    console.log("Max Rating ", maxRating);
  }
};
window.addEventListener("load", mainFunction);
