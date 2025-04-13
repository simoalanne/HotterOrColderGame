import { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { WeatherContext } from '../context/WeatherContext';

const Details = () => {
  const route = useRoute();
  const { date } = route.params;
  const { weatherData } = useContext(WeatherContext);

  // Filter data for the selected date
  const filteredData = weatherData.list.filter((entry) =>
    entry.dt_txt.startsWith(date)
  );

  // Calculate min and max temperature for the day
  const minTemp = Math.min(...filteredData.map((entry) => entry.main.temp_min));
  const maxTemp = Math.max(...filteredData.map((entry) => entry.main.temp_max));

  return (
    <View style={styles.container}>
      {/* Overview Card */}
      <View style={styles.overviewCard}>
        <Text style={styles.date}>
          {weatherData.city.name} {date}
        </Text>
        <Text style={styles.temp}>❄️ Coldest: {minTemp.toFixed(1)}°C</Text>
        <Text style={styles.temp}>🔥 Warmest: {maxTemp.toFixed(1)}°C</Text>
      </View>

      {/* Hourly Forecast List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.dt_txt}
        renderItem={({ item }) => (
          <View style={styles.hourlyCard}>
            <Text style={styles.time}>
              {item.dt_txt.split(' ')[1].slice(0, 5)}
            </Text>
            <Text style={styles.temp}>{item.main.temp.toFixed(1)}°C</Text>
            <Text style={styles.wind}>💨 {item.wind.speed.toFixed(1)} m/s</Text>
            <Text style={styles.pressure}>⏲️ {item.main.pressure} hPa</Text>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
              }}
              style={styles.icon}
            />
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
  overviewCard: {
    backgroundColor: '#2c2c2c',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  temp: {
    fontSize: 16,
    marginTop: 4,
    color: '#ddd',
  },
  hourlyCard: {
    backgroundColor: '#2c2c2c',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  wind: {
    fontSize: 14,
    color: '#bbb',
  },
  pressure: {
    fontSize: 14,
    color: '#bbb',
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default Details;
