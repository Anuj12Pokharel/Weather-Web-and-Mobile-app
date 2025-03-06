import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [bgClass, setBgClass] = useState('default-bg');

  // Function to fetch weather by coordinates
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/weather/', {
        params: { lat, lon }
      });
      setWeather(response.data);
      updateBg(response.data.weather[0]?.main);
      setError(null);
    } catch (err) {
      setError('Error fetching weather data.');
    }
  }, []);

  // Fetch location-based weather on initial load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => fetchWeatherByCoords(coords.latitude, coords.longitude),
        () => setError('Unable to retrieve your location.')
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, [fetchWeatherByCoords]);

  // Function to fetch weather by city name
  const fetchWeatherByCity = async () => {
    if (!city.trim()) {
      setError('Please enter a valid city name.');
      return;
    }
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/weather/', {
        params: { city }
      });
      setWeather(response.data);
      updateBg(response.data.weather[0]?.main);
      setError(null);
    } catch (err) {
      setError('Error fetching weather data for the city.');
    }
  };

  // Update background class based on weather condition
  const updateBg = (condition) => {
    if (!condition) return;
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) {
      setBgClass('rainy-bg');
    } else if (cond.includes('clear')) {
      setBgClass('sunny-bg');
    } else if (cond.includes('cloud')) {
      setBgClass('cloudy-bg');
    } else if (cond.includes('snow')) {
      setBgClass('snowy-bg');
    } else {
      setBgClass('default-bg');
    }
  };

  // Convert wind degrees to cardinal direction
  const getWindDirection = (deg) => {
    if (deg > 337.5 || deg <= 22.5) return 'N';
    else if (deg > 22.5 && deg <= 67.5) return 'NE';
    else if (deg > 67.5 && deg <= 112.5) return 'E';
    else if (deg > 112.5 && deg <= 157.5) return 'SE';
    else if (deg > 157.5 && deg <= 202.5) return 'S';
    else if (deg > 202.5 && deg <= 247.5) return 'SW';
    else if (deg > 247.5 && deg <= 292.5) return 'W';
    else if (deg > 292.5 && deg <= 337.5) return 'NW';
    return '';
  };

  // Compute local date and time using weather.dt and weather.timezone
  let localDateObj = new Date();
  let localDateString = '';
  let localTimeString = '';
  if (weather) {
    // weather.dt is in seconds; add timezone offset (also in seconds) then convert to ms.
    localDateObj = new Date((weather.dt + weather.timezone) * 1000);
    localDateString = localDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    localTimeString = localDateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className={`weather-container ${bgClass}`}>
      <div className="weather-top">
        <div className="location-and-date">
          <h2 className="location">{weather ? weather.name : 'Your City'}</h2>
          <p className="date">
            {weather ? localDateString : new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="time">
            {weather ? localTimeString : new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeatherByCity}>Search</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {weather && (
        <>
          <div className="weather-main">
            <div className="temperature">
              {Math.round(weather.main.temp)}°C
            </div>
            <div className="weather-description">
              {weather.weather[0]?.description
                ? `It's ${weather.weather[0].description}`
                : '...'}
            </div>
          </div>
          {/* Dynamic and responsive grid for weather details */}
          <div className="weather-details-grid">
            <div className="weather-detail-item">
              <span className="weather-detail-icon">📅</span>
              <span className="weather-detail-label">Local Date</span>
              <span className="weather-detail-value">{localDateString}</span>
            </div>
            <div className="weather-detail-item">
              <span className="weather-detail-icon">⏰</span>
              <span className="weather-detail-label">Local Time</span>
              <span className="weather-detail-value">{localTimeString}</span>
            </div>
            <div className="weather-detail-item">
              <span className="weather-detail-icon">💧</span>
              <span className="weather-detail-label">Humidity</span>
              <span className="weather-detail-value">{weather.main.humidity}%</span>
            </div>
            <div className="weather-detail-item">
              <span className="weather-detail-icon">📈</span>
              <span className="weather-detail-label">Pressure</span>
              <span className="weather-detail-value">{weather.main.pressure} hPa</span>
            </div>
            <div className="weather-detail-item">
              <span className="weather-detail-icon">🌡️</span>
              <span className="weather-detail-label">Feels Like</span>
              <span className="weather-detail-value">{Math.round(weather.main.feels_like)}°C</span>
            </div>
            <div className="weather-detail-item">
              <span className="weather-detail-icon">🔺</span>
              <span className="weather-detail-label">Max Temp</span>
              <span className="weather-detail-value">{Math.round(weather.main.temp_max)}°C</span>
            </div>
            <div className="weather-detail-item">
              <span className="weather-detail-icon">🔻</span>
              <span className="weather-detail-label">Min Temp</span>
              <span className="weather-detail-value">{Math.round(weather.main.temp_min)}°C</span>
            </div>
            <div className="weather-detail-item">
              <span className="weather-detail-icon">💨</span>
              <span className="weather-detail-label">Wind Speed</span>
              <span className="weather-detail-value">{weather.wind.speed} m/s</span>
            </div>
            <div className="weather-detail-item">
              <span className="weather-detail-icon">🧭</span>
              <span className="weather-detail-label">Wind Direction</span>
              <span className="weather-detail-value">{getWindDirection(weather.wind.deg)}</span>
            </div>
          </div>
        </>
      )}

      {/* Forecast card with mocked data (always visible) */}
      <div className="forecast-card">
        <h3>Weather Today</h3>
        <div className="forecast-grid">
          <div className="forecast-item">
            <p>08:00</p>
            <div className="forecast-icon">☀️</div>
            <p>15°C</p>
          </div>
          <div className="forecast-item">
            <p>12:00</p>
            <div className="forecast-icon">☀️</div>
            <p>20°C</p>
          </div>
          <div className="forecast-item">
            <p>16:00</p>
            <div className="forecast-icon">☁️</div>
            <p>18°C</p>
          </div>
          <div className="forecast-item">
            <p>20:00</p>
            <div className="forecast-icon">🌙</div>
            <p>12°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
