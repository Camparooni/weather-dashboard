const weatherAPI = '4ab176a56c782837241df54a2e301261';
const cityInput = document.querySelector('.search');
const searchButton = document.querySelector('.searchbtn');
const weatherCards = document.querySelector('.weather-cards');
const currentWeather = document.querySelector('.current-weather');


const createWeatherCard = (weatherItem) => {

    return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png">
                <h4>Temp: ${((weatherItem.main.temp -273.15) * 9/5 + 32).toFixed(2)}°F</h4>
                <h4>Wind: ${weatherItem.wind.speed} MPH</h4>
                <h4>Humidity: ${weatherItem.main.humidity} %</h4>
            </li>`;
}


const getWeatherDetails = (cityName, lat, lon) => {
    const weatherDetailsAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherAPI}`;

    fetch(weatherDetailsAPI).then(res => res.json()).then(data => {
        console.log(data);

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


        console.log(fiveDayForecast);
        fiveDayForecast.forEach(weatherItem => {
            if(index === 0) {
                weatherCards.insertAdjacentHTML('beforeend', createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCards.insertAdjacentHTML('beforeend', createWeatherCard(weatherItem));
            }
        });

    }).catch(() => {
        alert('Could not retrieve weather forecast');
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const geocodingAPI =`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${weatherAPI}`;

    fetch(geocodingAPI).then(res => res.json()).then(data => {
        if(!data.length) return alert('Could not retrieve coordinates for ${cityName}');
        const { name, lat, lon } = data[0];
        getWeatherDetails (name, lat, lon);
    }).catch(() => {
        alert('Could not retrieve coordinates');
    });
}

searchButton.addEventListener('click', getCityCoordinates);