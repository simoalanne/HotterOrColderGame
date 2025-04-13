import { useState, useContext } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WeatherContext } from '../context/WeatherContext';
import LocateMeButton from './LocateMeButton';
import { getWeeklyForecast } from '../api/openWeatherMapApi';
import CustomButton from './CustomButton';
import getIsNightOrDay from '../utils/getIsNightOrDay';

const Home = () => {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const { setWeatherData } = useContext(WeatherContext);
  const navigation = useNavigation();

  const fetchForecast = async (fetchedCity) => {
    try {
      if (!fetchedCity.trim()) {
        setError('Location cannot be empty');
        return;
      }
      const weatherData = await getWeeklyForecast(fetchedCity || city);
      setWeatherData(weatherData);
      navigation.navigate('Forecast');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (text) => {
    setCity(text);
    if (error) setError('');
  };

  const weatherImage =
    getIsNightOrDay() === 'night'
      ? require('../assets/night-sky.png')
      : require('../assets/day-sky.png');

  const cityImage =
    getIsNightOrDay() === 'night'
      ? require('../assets/night-city.png')
      : require('../assets/day-city.png');

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={weatherImage} style={styles.weatherBackground}>
        <View style={styles.weatherContainer}>
          <Text style={styles.header}>{`Weather Forecast ${getIsNightOrDay() === 'night' ? "🌙" : "🌤️"}`}</Text>
          <View style={styles.searchContainer}>
            <LocateMeButton
              onLocationFetched={({ name }) => fetchForecast(name)}
              onError={setError}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter location..."
              value={city}
              onChangeText={handleInputChange}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => fetchForecast(city)}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </ImageBackground>

      <ImageBackground source={cityImage} style={styles.gameBackground}>
        <View style={styles.gameContainer}>
          <Text style={styles.header}>Hotter VS Colder Game</Text>
          <CustomButton
            label="Play"
            onPress={() => navigation.navigate('Hotter VS Colder')}
            gradientColors={['#FFA500', '#FFD700']}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 2,
    height: 50,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderRightWidth: 0,
  },
  searchButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#4682B4',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  gameContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 25,
    marginBottom: 10,
    width: '80%'
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
});

export default Home;
