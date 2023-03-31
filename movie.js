function generateMovieBlock(movie) { //a function to generate html content
    const movieBlock = document.createElement('div');
    const infoBlock = document.createElement('div');
    const imageBlock = document.createElement('img');
    const title = document.createElement('h2');
    const subtitle = document.createElement('p');
    const genre = document.createElement('span');
    const year = document.createElement('span');

    movieBlock.appendChild(imageBlock);
    movieBlock.appendChild(infoBlock);
    infoBlock.appendChild(title);
    infoBlock.appendChild(subtitle);
    subtitle.appendChild(genre);
    subtitle.appendChild(year);

    imageBlock.setAttribute('src', movie.Poster);
    imageBlock.setAttribute('alt', movie.Title);
    infoBlock.classList.add('info');
    title.classList.add('title');
    title.textContent = movie.Title;
    subtitle.classList.add('subtitle');
    genre.textContent = movie.Type;
    year.textContent = movie.Year;

    movieBlock.addEventListener('click', () => {
        window.open('https://www.imdb.com/title/' + movie.imdbID, '_blank')
    });

    return movieBlock;
}

function displayMovies(data) {
    countElement.textContent = 'Нашли ' + data.totalResults + ' фильма';

    const movies = data.Search;

    movies.forEach(movie => {
        const movieBlock = generateMovieBlock(movie);
        movieList.appendChild(movieBlock);
    });
}

function generateErrorBlock() {
    let errorBlock = document.createElement('h2');
    errorBlock.textContent = 'Oшибка~';
    errorBlock.id = 'error-block';
    return errorBlock;
}

function generatePreloaderBlock() {
    let preloaderBlock = document.createElement('img');
    preloaderBlock.src = 'assets/loader.gif';
    preloaderBlock.id = 'preloader';
    return preloaderBlock;
}

function displayMoviesOrError(success, data) { //if something goes wrong, show an error instead of a list of movies
    if (success && data.Response === 'True') {
        displayMovies(data);
    } else {
        movieList.appendChild(generateErrorBlock());
    }
}

function updateMovieList(searchValue, response) {
    storeTag(searchValue);
    removeAllChildren(movieList);
    removeAllChildren(countElement);

    displayMoviesOrError(response.success, response.data);

    displayTags();
}