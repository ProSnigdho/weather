const apiKey = 2b634bc1e1c364db10c2067ec4cf250b; // Replace with your OpenWeatherMap API key
const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');
const currentWeatherDetails = document.getElementById('currentWeatherDetails');
const forecastDetails = document.getElementById('forecastDetails');

// Fetch current weather and forecast data
async function getWeatherData(city) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const currentResponse = await fetch(currentWeatherUrl);
    const currentData = await currentResponse.json();

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    // Display current weather
    document.getElementById('cityName').textContent = `${currentData.name}, ${currentData.sys.country}`;
    document.getElementById('temperature').textContent = `Temperature: ${currentData.main.temp}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${currentData.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${currentData.wind.speed} km/h`;

    // Display 5-day forecast
    forecastDetails.innerHTML = ''; // Clear previous forecast
    for (let i = 0; i < forecastData.list.length; i += 8) { // Only show forecast at 12:00 PM each day
      const forecast = forecastData.list[i];
      const forecastCard = document.createElement('div');
      forecastCard.classList.add('forecast-card');
      forecastCard.innerHTML = `
        <h4>${new Date(forecast.dt_txt).toLocaleDateString()}</h4>
        <p>Temp: ${forecast.main.temp}°C</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
        <p>Wind: ${forecast.wind.speed} km/h</p>
      `;
      forecastDetails.appendChild(forecastCard);
    }
  } catch (error) {
    alert('Failed to fetch data. Please try again.');
  }
}

// Event listener for search button
searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
  } else {
    alert('Please enter a city name');
  }
});
