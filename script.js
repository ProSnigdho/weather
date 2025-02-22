const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');
const currentWeatherDetails = document.getElementById('currentWeatherDetails');
const forecastDetails = document.getElementById('forecastDetails');

// Geocoding API for getting latitude and longitude from a city name
async function getCityCoordinates(city) {
  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en`;
  
  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    if (data.results.length > 0) {
      const latitude = data.results[0].latitude;
      const longitude = data.results[0].longitude;
      return { latitude, longitude };
    } else {
      alert("City not found. Please try again.");
      return null;
    }
  } catch (error) {
    alert("Error fetching data. Please try again.");
    console.error(error);
  }
}

// Fetch current weather and forecast data from Open-Meteo API
async function getWeatherData(city) {
  const coordinates = await getCityCoordinates(city);
  if (!coordinates) return;

  const { latitude, longitude } = coordinates;
  
  // Current weather API endpoint
  const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  // 5-day forecast API endpoint
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=Europe%2FLondon`;

  try {
    const currentResponse = await fetch(currentWeatherUrl);
    const currentData = await currentResponse.json();

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    // Display current weather
    document.getElementById('cityName').textContent = city;
    document.getElementById('temperature').textContent = `Temperature: ${currentData.current_weather.temperature}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${currentData.current_weather.relative_humidity} %`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${currentData.current_weather.windspeed} km/h`;

    // Display 5-day forecast
    forecastDetails.innerHTML = ''; // Clear previous forecast
    forecastData.daily.temperature_2m_max.forEach((tempMax, index) => {
      const forecastCard = document.createElement('div');
      forecastCard.classList.add('forecast-card');
      forecastCard.innerHTML = `
        <h4>${new Date(forecastData.daily.time[index]).toLocaleDateString()}</h4>
        <p>Max Temp: ${tempMax}°C</p>
        <p>Min Temp: ${forecastData.daily.temperature_2m_min[index]}°C</p>
        <p>Precipitation: ${forecastData.daily.precipitation_sum[index]} mm</p>
        <p>Max Wind: ${forecastData.daily.windspeed_10m_max[index]} km/h</p>
      `;
      forecastDetails.appendChild(forecastCard);
    });

  } catch (error) {
    alert("Error fetching weather data. Please try again.");
    console.error(error);
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
