const weatherAPI = '4ab176a56c782837241df54a2e301261';
const cityInput = document.querySelector('.search');
const searchButton = document.querySelector('.searchbtn');
const weatherCards = document.querySelector('.weather-cards');
const currentWeather = document.querySelector('.current-weather');
const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year}`;
};

const createWeatherCard = (cityName, weatherItem, index) => {
    const formattedDate = formatDate(weatherItem.dt_txt.split(" ")[0]);


    if(index === 0) {
        return `<div class="details">
                    <h2>${cityName} (${formattedDate})</h2>
                    <h4>Temp: ${((weatherItem.main.temp -273.15) * 9/5 + 32).toFixed(2)}°F</h4>
                    <h4>Wind: ${weatherItem.wind.speed} MPH</h4>
                    <h4>Humidity: ${weatherItem.main.humidity} %</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;

    } else {
        return `<li class="card">
                <h3>(${formattedDate})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png">
                <h4>Temp: ${((weatherItem.main.temp -273.15) * 9/5 + 32).toFixed(2)}°F</h4>
                <h4>Wind: ${weatherItem.wind.speed} MPH</h4>
                <h4>Humidity: ${weatherItem.main.humidity} %</h4>
            </li>`;
    }
}


const getWeatherDetails = (cityName, lat, lon) => {
    const weatherDetailsAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherAPI}`;

    fetch(weatherDetailsAPI).then(res => res.json()).then(data => {
        

        const forecastDays = [];
        const fiveDayForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!forecastDays.includes(forecastDate)) {
                return forecastDays.push(forecastDate);
            }
        });

        cityInput.value = '';
        currentWeather.innerHTML = '';
        weatherCards.innerHTML = '';


        fiveDayForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeather.insertAdjacentHTML('beforeend', createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCards.insertAdjacentHTML('beforeend', createWeatherCard(cityName, weatherItem, index));
            }
        });

    }).catch(() => {
        alert('Could not retrieve weather forecast');
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const geocodingAPI =`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${weatherAPI}`;

    fetch(geocodingAPI).then(res => res.json()).then(data => {
        if(!data.length) return alert('Could not retrieve coordinates for ${cityName}');
        const { name, lat, lon } = data[0];
        getWeatherDetails (name, lat, lon);

    }).catch(() => {
        alert('Could not retrieve coordinates');
    });
}

searchButton.addEventListener('click', getCityCoordinates);


function addToSearchHistory(city) {
    const listItem = document.createElement('li');
    listItem.textContent = city;

    listItem.addEventListener('click', function () {
        handleSearchHistoryClick(city);
    });

    historyList.appendChild(listItem);
}

function handleSearchHistoryClick(city) {
    fetchWeatherData(city);
}


function updateSearchHistory(city) {
    searchHistory.unshift(city);
    if (searchHistory.length > 10) {
        searchHistory.pop();
    }

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function loadSearchHistory() {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(...savedHistory); 

    searchHistory.forEach((city) => {
        addToSearchHistory(city);
    });
}

function initSearchHistory() {
    loadSearchHistory();
}

initSearchHistory();


searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        addToSearchHistory(city);
    }
});