import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

function WeatherApp() {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState(
    'https://www.shutterstock.com/image-vector/blue-sky-clouds-anime-style-600nw-2157978867.jpg'
  );

  // Fetch weather data by coordinates
  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    try {
      const response = await axios.get('http://192.168.18.198:8000/api/weather/', {
        params: { lat, lon },
      });
      setWeather(response.data);
      updateBg(response.data.weather[0]?.main);
      setError(null);
    } catch (err) {
      setError('Error fetching weather data.');
    }
  }, []);

  // Fetch weather data by city name
  const fetchWeatherByCity = async () => {
    if (!city.trim()) {
      setError('Please enter a valid city name.');
      return;
    }
    try {
      const response = await axios.get('http://192.168.18.198:8000/api/weather/', {
        params: { city },
      });
      setWeather(response.data);
      updateBg(response.data.weather[0]?.main);
      setError(null);
    } catch (err) {
      setError('Error fetching weather data for the city.');
    }
  };

  // Update background image based on weather condition
  const updateBg = (condition: string) => {
    if (!condition) return;
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) {
      setBgImage(
        'https://static.vecteezy.com/system/resources/previews/012/098/044/non_2x/illustration-of-heavy-rain-cloudy-weather-with-cartoon-animation-style-rainy-scenery-background.jpg'
      );
    } else if (cond.includes('clear')) {
      setBgImage(
        'https://st3.depositphotos.com/1324256/18719/i/450/depositphotos_187196986-stock-photo-asphalt-road-sparkle-hot-sun.jpg'
      );
    } else if (cond.includes('cloud')) {
      setBgImage(
        'https://www.rochesterfirst.com/wp-content/uploads/sites/66/2021/04/storm-466677_1920.jpg?w=900'
      );
    } else if (cond.includes('snow')) {
      setBgImage(
        'https://plus.unsplash.com/premium_photo-1676747433701-ebe10f095b77?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3'
      );
    } else {
      setBgImage(
        'https://www.shutterstock.com/image-vector/blue-sky-clouds-anime-style-600nw-2157978867.jpg'
      );
    }
  };

  // Convert wind degrees to cardinal direction
  const getWindDirection = (deg: number): string => {
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

  // Request location permissions and fetch weather by coordinates
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      fetchWeatherByCoords(location.coords.latitude, location.coords.longitude);
    })();
  }, [fetchWeatherByCoords]);

  // Compute local date and time based on weather data
  let localDateString = '';
  let localTimeString = '';
  if (weather) {
    const localDateObj = new Date((weather.dt + weather.timezone) * 1000);
    localDateString = localDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    localTimeString = localDateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    localDateString = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    localTimeString = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <ImageBackground source={{ uri: bgImage }} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.locationAndDate}>
            <Text style={styles.location}>{weather ? weather.name : 'Your City'}</Text>
            <Text style={styles.date}>{localDateString}</Text>
            <Text style={styles.time}>{localTimeString}</Text>
          </View>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter city..."
              placeholderTextColor="#666"
              value={city}
              onChangeText={setCity}
            />
            <TouchableOpacity style={styles.searchButton} onPress={fetchWeatherByCity}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        {/* Weather Info */}
        {weather && (
          <>
            <View style={styles.weatherMain}>
              <Text style={styles.temperature}>{Math.round(weather.main.temp)}°C</Text>
              <Text style={styles.weatherDescription}>
                {weather.weather[0]?.description
                  ? `It's ${weather.weather[0].description}`
                  : '...'}
              </Text>
            </View>
            <View style={styles.weatherDetailsGrid}>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailIcon}>📅</Text>
                <Text style={styles.weatherDetailLabel}>Local Date</Text>
                <Text style={styles.weatherDetailValue}>{localDateString}</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailIcon}>⏰</Text>
                <Text style={styles.weatherDetailLabel}>Local Time</Text>
                <Text style={styles.weatherDetailValue}>{localTimeString}</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailIcon}>💧</Text>
                <Text style={styles.weatherDetailLabel}>Humidity</Text>
                <Text style={styles.weatherDetailValue}>{weather.main.humidity}%</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailIcon}>📈</Text>
                <Text style={styles.weatherDetailLabel}>Pressure</Text>
                <Text style={styles.weatherDetailValue}>{weather.main.pressure} hPa</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailIcon}>🌡️</Text>
                <Text style={styles.weatherDetailLabel}>Feels Like</Text>
                <Text style={styles.weatherDetailValue}>{Math.round(weather.main.feels_like)}°C</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailIcon}>🔺</Text>
                <Text style={styles.weatherDetailLabel}>Max Temp</Text>
                <Text style={styles.weatherDetailValue}>{Math.round(weather.main.temp_max)}°C</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailIcon}>🔻</Text>
                <Text style={styles.weatherDetailLabel}>Min Temp</Text>
                <Text style={styles.weatherDetailValue}>{Math.round(weather.main.temp_min)}°C</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailIcon}>💨</Text>
                <Text style={styles.weatherDetailLabel}>Wind Speed</Text>
                <Text style={styles.weatherDetailValue}>{weather.wind.speed} m/s</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailIcon}>🧭</Text>
                <Text style={styles.weatherDetailLabel}>Wind Direction</Text>
                <Text style={styles.weatherDetailValue}>{getWindDirection(weather.wind.deg)}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

export default function Index() {
  return <WeatherApp />;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  topSection: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  locationAndDate: {
    alignItems: 'center',
    marginBottom: 10,
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  time: {
    fontSize: 16,
    color: '#fff',
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    marginRight: 8,
    color: '#000',
  },
  searchButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'rgba(255,0,0,0.2)',
    color: '#fff',
    textAlign: 'center',
    borderRadius: 8,
  },
  weatherMain: {
    alignItems: 'center',
    marginVertical: 20,
  },
  temperature: {
    fontSize: 48,
    color: '#fff',
  },
  weatherDescription: {
    fontSize: 20,
    color: '#fff',
    textTransform: 'capitalize',
    marginTop: 5,
  },
  weatherDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#ffd700',
    borderRadius: 8,
    marginBottom: 20,
  },
  weatherDetailItem: {
    width: '45%',
    alignItems: 'center',
    marginVertical: 10,
  },
  weatherDetailIcon: {
    fontSize: 24,
  },
  weatherDetailLabel: {
    fontWeight: 'bold',
    marginTop: 5,
    color: '#fff',
  },
  weatherDetailValue: {
    marginTop: 2,
    color: '#fff',
  },
});

