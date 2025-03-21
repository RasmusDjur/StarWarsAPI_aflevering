let itemsPerPageCharacters = 6; // Define how many characters show per page 
let itemsPerPagePlanets = 8; // Define how many planets show per page 

let characters = [];
let planets = [];
let filteredPlanets = [];  // This will hold the filtered planets based on climate
let films = [];
let currentPageCharacters = 1;
let currentPagePlanets = 1;
let totalPagesCharacters = 0;
let totalPagesPlanets = 0;

let filteredCharacters = [];

// -------------- //
// Character Code // 
// -------------- //
// Render the character list based on the current page and filtered data
function renderCharacterList(filteredCharacters = characters) {
    const list = document.getElementById('character-list');
    list.innerHTML = '';

    const startIndex = (currentPageCharacters - 1) * itemsPerPageCharacters;
    const endIndex = startIndex + itemsPerPageCharacters;
    const currentPageCharactersList = filteredCharacters.slice(startIndex, endIndex);

    currentPageCharactersList.forEach(character => {
        const listItem = document.createElement('li');
        listItem.classList.add('character-item');
        listItem.innerHTML = `
            <strong>${character.name}</strong><br>
            Height: ${character.height}<br>
            Birth Year: ${character.birth_year}<br>
            Gender: ${character.gender}
        `;
        list.appendChild(listItem);
    });
}

// Render pagination controls for characters
function renderCharacterPagination(filteredCharacters = characters) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    totalPagesCharacters = Math.ceil(filteredCharacters.length / itemsPerPageCharacters); // Recalculate total pages for filtered list

    for (let i = 1; i <= totalPagesCharacters; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => {
            currentPageCharacters = i;
            renderCharacterList(filteredCharacters);
        };
        pagination.appendChild(button);
    }
}

// Fetch characters data from the API
async function fetchCharacters() {
    let url = 'https://swapi.py4e.com/api/people/';
    characters = [];  // Clear previous characters data
    while (url) {
        const response = await fetch(url);
        const data = await response.json();
        characters = characters.concat(data.results);  // Add new characters to the array
        totalPagesCharacters = Math.ceil(characters.length / itemsPerPageCharacters);  // Update total pages after data is fetched
        url = data.next;  // Get the URL for the next page (if any)
    }
    filteredCharacters = [...characters]; // Initially set filtered characters to all characters
    renderCharacterList();  // Render the full list initially
    renderCharacterPagination();
}

// Search for characters by name
function searchCharacters() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    console.log('Search query:', searchQuery);
    filteredCharacters = characters.filter(character => character.name.toLowerCase().includes(searchQuery));
    console.log('Filtered characters:', filteredCharacters);
    renderCharacterList(filteredCharacters);  // Pass filtered characters here
    renderCharacterPagination(filteredCharacters);  // Update pagination based on filtered characters
}

// -------------- //
//  Planet Code   // 
// -------------- //
// Render the planet list based on the current page
function renderPlanetList() {
    const list = document.getElementById('planet-list');
    list.innerHTML = '';

    const startIndex = (currentPagePlanets - 1) * itemsPerPagePlanets;
    const endIndex = startIndex + itemsPerPagePlanets;
    const currentPagePlanetsList = filteredPlanets.slice(startIndex, endIndex);

    currentPagePlanetsList.forEach(planet => {
        const listItem = document.createElement('li');
        listItem.classList.add('planet-item');
        listItem.innerHTML = `
            <strong>${planet.name}</strong><br>
            Population: ${planet.population}<br>
            Climate: ${planet.climate}<br>
            Terrain: ${planet.terrain}
        `;
        list.appendChild(listItem);
    });
}

// Render pagination controls for planets
function renderPlanetPagination() {
    const pagination = document.getElementById('planet-pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPagesPlanets; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => {
            currentPagePlanets = i;
            renderPlanetList();
        };
        pagination.appendChild(button);
    }
}

// Dynamically populate the climate filter dropdown with unique climates from planets
function populateClimateDropDown() {
    const climateSelect = document.getElementById('climate-filter');
    if (!climateSelect) return;  // Return if the dropdown is not found

    // Clear existing options
    climateSelect.innerHTML = '<option value="">Select Climate</option>';

    // Get unique climates from the planets data
    const climates = [...new Set(planets.map(planet => planet.climate).filter(climate => climate))];

    // Add each climate as an option in the dropdown
    climates.forEach(climate => {
        const option = document.createElement('option');
        option.value = climate.toLowerCase();  // To ensure case-insensitive matching
        option.textContent = climate;
        climateSelect.appendChild(option);
    });
}

// Filter planets based on selected climate
function filterPlanetsByClimate(climate) {
    if (!climate) {
        filteredPlanets = [...planets];  // If no climate is selected, show all planets
    } else {
        filteredPlanets = planets.filter(planet => planet.climate.toLowerCase().includes(climate.toLowerCase()));
    }
    totalPagesPlanets = Math.ceil(filteredPlanets.length / itemsPerPagePlanets);  // Update total pages based on filtered planets
    currentPagePlanets = 1;  // Reset to first page after filtering
    renderPlanetList();
    renderPlanetPagination();
}

// Fetch planets data from the API
async function fetchPlanets() {
    let url = 'https://swapi.py4e.com/api/planets/';
    planets = [];  // Clear previous planets data
    while (url) {
        const response = await fetch(url);
        const data = await response.json();
        planets = planets.concat(data.results);  // Add new planets to the array
        url = data.next;  // Get the URL for the next page (if any)
    }
    
    populateClimateDropDown();  // Populate the dropdown after fetching the planets
    filteredPlanets = [...planets];  // Initially set filtered planets to all planets
    renderPlanetList();
    renderPlanetPagination();
}

// Event listener for climate selection
document.getElementById('climate-filter').addEventListener('change', (event) => {
    const selectedClimate = event.target.value;
    filterPlanetsByClimate(selectedClimate);
});






// -------------- //
//   Film Code    // 
// -------------- //

// Fetch films data from the API
async function fetchFilms() {
    const url = 'https://swapi.py4e.com/api/films/';
    const response = await fetch(url);
    const data = await response.json();
    films = data.results; // Store the films data
    
    console.log(films);  // Log films to see if it's populated

    renderFilmList(); // Render the films after fetching
}

// Render the film list
function renderFilmList() {
    const list = document.getElementById('film-list');
    list.innerHTML = ''; // Clear the existing list

    if (films.length > 0) {
        films.forEach(film => {
            const listItem = document.createElement('li');
            listItem.classList.add('film-item');
            listItem.innerHTML = `
                <strong>${film.title}</strong><br>
                Release Date: ${film.release_date}
            `;
            listItem.onclick = () => openFilmModal(film); // Show the modal when clicked
            list.appendChild(listItem);
        });
    } else {
        // Handle case when there are no films
        list.innerHTML = '<li>No films available</li>';
    }
}

// Show the modal with the film's opening crawl
function openFilmModal(film) {
    const modal = document.getElementById('film-modal');
    const modalTitle = document.getElementById('modal-film-title');
    const modalCrawl = document.getElementById('modal-opening-crawl');

    modalTitle.textContent = film.title; // Set the title in the modal
    modalCrawl.textContent = film.opening_crawl; // Set the opening crawl in the modal

    modal.style.display = 'block'; // Show the modal
}

// Close the modal when the user clicks the "X"
document.getElementById('close-modal').onclick = () => {
    const modal = document.getElementById('film-modal');
    modal.style.display = 'none'; // Hide the modal
};

// Function to play the music
function playStarWarsMusic() {
    let audio = document.getElementById("starWarsTheme");

    // Try playing immediately
    let playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => console.log("Music is playing"))
            .catch(() => {
                console.log("Autoplay blocked. Waiting for user interaction...");
                document.addEventListener("click", playOnInteraction, { once: true });
            });
    }
}

// Play music after the first click if blocked
function playOnInteraction() {
    let audio = document.getElementById("starWarsTheme");
    audio.play();
}

// Initial fetch when the page loads
window.onload = () => {
    fetchCharacters();
    fetchPlanets();
    fetchFilms();

    document.getElementById('search').addEventListener('input', searchCharacters);
    playStarWarsMusic();
};







