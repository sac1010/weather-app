function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeather, handleLocationError);
    } else {
        handleLocationError();
    }
}

function fetchWeather(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=928fb433737cacff07d85ad5e1fb2515&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            getForecast(latitude, longitude);
        })
        .catch(error => {
            console.log('Error fetching current weather data:', error);
            displayErrorMessage();
        });
}

function getForecast(latitude, longitude) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=928fb433737cacff07d85ad5e1fb2515&units=metric`;

    fetch(forecastApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch forecast data');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.log('Error fetching forecast data:', error);
            displayErrorMessage();
        });
}

function handleLocationError(error) {
    console.log('Error getting location:', error);
    const lastLocation = localStorage.getItem('lastLocation');
    if (lastLocation) {
        const savedLocation = JSON.parse(lastLocation);
        fetchWeather({ coords: { latitude: savedLocation.lat, longitude: savedLocation.lon } });
    } else {
        promptForLocation();
    }
}

function promptForLocation() {
    const city = prompt('Please enter your city:');
    if (city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=928fb433737cacff07d85ad5e1fb2515&units=metric`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                localStorage.setItem('lastLocation', JSON.stringify({ lat: data.coord.lat, lon: data.coord.lon }));
                getForecast(data.coord.lat, data.coord.lon);
            })
            .catch(error => {
                console.log('Error fetching current weather data:', error);
                displayErrorMessage();
            });
    }
}

function searchWeather() {
    const city = document.getElementById('cityInput').value;
    if (city.trim() !== '') {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=928fb433737cacff07d85ad5e1fb2515&units=metric`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                localStorage.setItem('lastLocation', JSON.stringify({ lat: data.coord.lat, lon: data.coord.lon }));
                getForecast(data.coord.lat, data.coord.lon);
            })
            .catch(error => {
                console.log('Error fetching current weather data:', error);
                displayErrorMessage();
            });
    } else {
        alert('Please enter a city.');
    }
}

function displayCurrentWeather(data) {
    const weatherIcon = document.getElementById('weatherIcon');
    const temperatureElement = document.getElementById('temperature');
    const weatherDetailsElement = document.getElementById('weatherDetails');
    const cityNameElement = document.getElementById('cityName');

    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">`;
    temperatureElement.textContent = `${data.main.temp}°C`;
    weatherDetailsElement.innerHTML = `
        <div>${data.weather[0].description}</div>
        <div>Humidity: ${data.main.humidity}%</div>
        <div>Wind Speed: ${data.wind.speed} m/s</div>
    `;
    cityNameElement.textContent = `${data.name}, ${data.sys.country}`;
}

function displayErrorMessage() {
    const forecastInfo = document.getElementById('forecastInfo');
    forecastInfo.innerHTML = '<p>Failed to fetch weather data. Please try again.</p>';
}

function displayForecast(data) {
    const forecastInfo = document.getElementById('forecastInfo');
    forecastInfo.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const forecast = data.list[i * 8]; 

        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecastDay');
        forecastDay.innerHTML = `
            <h3>${getDateString(forecast.dt)}</h3>
            <div><img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon"></div>
            <div>${forecast.main.temp}°C</div>
        `;
        forecastInfo.appendChild(forecastDay);
    }
}

function getDateString(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dayOfMonth = date.getDate();
    return `${day}`;
}

// Initial load
getWeather();
