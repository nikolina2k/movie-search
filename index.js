const BASE_URL = 'https://www.omdbapi.com';
const API_KEY = 'de6f1e37';

const searchElement = document.getElementById('search-input');
const countElement = document.getElementById('result-count');
const movieList = document.getElementById('movie-list');
const searchTags = document.getElementById('search-results');

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

async function fetchData(searchValue) { //getting the movie data from imdb
    const url = BASE_URL + '/?s=' + searchValue + '&apikey=' + API_KEY;
    const response = await fetch(url);
    const data = await response.json();
    const success = response.ok;

    return { success, data };
}

async function fetchDataFromCacheOrAPI(searchValue) {
    let success, data;
    const cachedResponse = getResponseFromLocalStorage(searchValue);

    if (cachedResponse) {
        success = true;
        data = cachedResponse;
        console.log('did not use it');
    } else {
        const result = await fetchData(searchValue);
        success = result.success;
        data = result.data;
        storeResponseInLocalStorage(searchValue, data);
        console.log('did use it');
    }

    return { success, data };
}

searchElement.addEventListener('keyup', async (event) => { //pressing enter makes a request to OMDBAPI
    const searchValue = searchElement.value;

    if (event.key === 'Enter' || event.keyCode === 13) {

        showPreloader();

        let response = await fetchDataFromCacheOrAPI(searchValue);

        updateMovieList(searchValue, response);
    }

});

function storeResponseInLocalStorage(key, response) {
    localStorage.setItem(key.toLowerCase(), JSON.stringify(response));
}

function getResponseFromLocalStorage(key) {
    const cachedData = localStorage.getItem(key.toLowerCase());

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    return null;
}

function showPreloader() {
    removeAllChildren(movieList);
    movieList.appendChild(generatePreloaderBlock());
}

//window.onload = localStorage.clear();