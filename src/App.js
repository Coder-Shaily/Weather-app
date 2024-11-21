import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const cityRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);

  const getWeather = () => {
    const city = cityRef.current.value;

    if (!city) {
      alert('Please enter a city');
      return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          setWeatherData(data);
          setError(null);
        } else {
          setError(data.message);
          setWeatherData(null);
        }
      })
      .catch(error => {
        console.error('Error fetching current weather data:', error);
        alert('Error fetching current weather data. Please try again.');
      });

    fetch(forecastUrl)
      .then(response => response.json())
      .then(data => {
        if (data.cod === "200") {
          setForecastData(data.list.slice(0, 8)); // Next 24 hours in 3-hour intervals
        } else {
          alert('Error fetching forecast data.');
        }
      })
      .catch(error => {
        console.error('Error fetching hourly forecast data:', error);
        alert('Error fetching hourly forecast data. Please try again.');
      });
  };

  const displayWeather = () => {
    if (error) return <p>THE ERROR IS: {error}</p>;
    if (!weatherData) return null;

    const temperature = Math.round(weatherData.main.temp - 273.15);
    const description = weatherData.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;

    return (
      <div>
        <p>{weatherData.name}</p>
        <p>{temperature}°C</p>
        <p>{(description).toUpperCase()}</p>
        <img src={iconUrl} alt={description} id="weather-icon" style={{ display: 'block' }} />
      </div>
    );
  };

  const displayHourlyForecast = () => {
    return forecastData.map((item, index) => { // map, reduce, filter, promises, async await
      const dateTime = new Date(item.dt * 1000);
      const hour = dateTime.getHours();
      const temperature = Math.round(item.main.temp - 273.15);
      const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

      return (
        <div key={index} className="hourly-item">
          <span>{hour}:00</span>
          <img src={iconUrl} alt="Hourly Weather Icon" />
          <span>{temperature}°C</span>
        </div>
      );
    });
  };

  return (
    <div id="App">
      <div id="weather-container">
        <h2>Weather App</h2>
        <input type="text" ref={cityRef} placeholder="Enter City" />
        <button onClick={getWeather}>Search</button>

        <div id="temp-div">{displayWeather()}</div>
        <div id="hourly-forecast">{displayHourlyForecast()}</div>
      </div>
    </div>
  );
}

export default App;
