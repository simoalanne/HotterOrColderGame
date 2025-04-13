import { useContext } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { WeatherContext } from '../context/WeatherContext';

const Forecast = () => {
  const { weatherData } = useContext(WeatherContext);
  const navigation = useNavigation(); // Get navigation

  // gets the date part of the api dt_txt by removing the time
  const getDate = (dateStr) => dateStr.split(' ')[0];

  const processDayData = (date, temps, weatherConditions, weathers) => {
    const frequencyMap = weatherConditions.reduce((object, key) => {
      object[key] = (object[key] || 0) + 1;
      return object;
    }, {});

    const mostCommonCondition = Object.entries(frequencyMap).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max)
    )[0];

    const avgTemp = temps.reduce((sum, temp) => sum + temp) / temps.length;

    weathers.push({
      date: date,
      temp: avgTemp.toFixed(1),
      weather: mostCommonCondition,
    });
  };

  const forecastData = () => {
    const weathers = [];
    let temps = [];
    let weatherConditions = [];
    let currentDate = getDate(weatherData.list[0].dt_txt);

    for (const entry of weatherData.list) {
      const entrysDate = getDate(entry.dt_txt);

      if (entrysDate !== currentDate) {
        processDayData(currentDate, temps, weatherConditions, weathers); // Push previous day's data
        temps = [];
        weatherConditions = [];
        currentDate = entrysDate;
      }

      temps.push(entry.main.temp);
      weatherConditions.push(entry.weather[0].description);
    }

    // push the final data too so last day is also included in the list
    processDayData(currentDate, temps, weatherConditions, weathers);

    return weathers;
  };

  const data = forecastData();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {weatherData.city.name} - 5 Day Forecast
      </Text>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.forecastItem}>
            <View style={styles.infoContainer}>
              <View>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.temp}>{item.temp}°C</Text>
                <Text style={styles.weather}>{item.weather}</Text>
              </View>
              <Button
                title="Details"
                onPress={() =>
                  navigation.navigate('Details', { date: item.date })
                }
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#181818',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  forecastItem: {
    backgroundColor: '#2c2c2c',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  temp: {
    fontSize: 16,
    color: '#ccc',
  },
  weather: {
    fontSize: 14,
    color: '#bbb',
  },
});


export default Forecast;
