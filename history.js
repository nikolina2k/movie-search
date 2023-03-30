function generateHistoryTag(history, id) { //a function for creating a search history result

    const historyBlock = document.createElement('div');
    const innerP = document.createElement('p');

    historyBlock.classList.add('history');
    innerP.textContent = history;

    historyBlock.appendChild(innerP);
    let pendingClick = 0;

    historyBlock.addEventListener('click', function (event) {

        if (pendingClick) {
            clearTimeout(pendingClick);
            pendingClick = 0;
        }

        if (event.detail === 1) {
                pendingClick = setTimeout(function () {
                    updateMovieListFromCache(innerP.textContent);
                }, 500);
                } else {
                    pendingClick = setTimeout(function () {
                    removeTag(innerP.textContent);
                    historyBlock.remove();
                    }, 500);                    
        }
    }, false);

    return historyBlock;
}

function updateMovieListFromCache(searchValue) {
    let data = getResponseFromLocalStorage(searchValue);
    updateMovieList(searchValue, { success: true, data: data });
    searchElement.value = searchValue;
}

function storeTag(tag) { //storing search history results in localStorage
    let history = localStorage.getItem('tags');
    let searchHistory = [];
    if (history) {
        searchHistory = JSON.parse(history);
    }
    searchHistory.push(tag.toLowerCase());
    searchHistory = searchHistory.filter((value, index, array) => {return array.indexOf(value) === index;});
    localStorage.setItem('tags', JSON.stringify(searchHistory));
}

function getTags() {
    let searchHistory = localStorage.getItem('tags');
    if (searchHistory) {
        return JSON.parse(searchHistory);
    }

    return [];
}

function removeTag(tag) {
    let tags = JSON.parse(localStorage.getItem('tags'));
    tags = tags.filter(item => item !== tag);
    localStorage.setItem('tags', JSON.stringify(tags));
}

function displayTags() {
    removeAllChildren(searchTags);
    let histories = getTags();
    histories = histories.slice().reverse();
    let i = 0;

    histories.forEach(history => {
        const historyTag = generateHistoryTag(history, i);
        i++;
        searchTags.appendChild(historyTag);
    });
}

function loadApplicationState() {
    let tags = getTags();

    if (tags.length) {
        let lastSearchValue = tags[tags.length - 1];
        updateMovieListFromCache(lastSearchValue);
    }
}

window.onchange = () => displayTags();
window.onload = () => loadApplicationState();