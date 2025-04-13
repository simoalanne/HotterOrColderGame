import { View, Text, StyleSheet } from 'react-native';
import CountryFlag from './CountryFlag';
const CityNameAndFlag = ({ cityName, countryCode }) => {
  return (
    <View style={styles.cityNameAndFlagContainer}>
      <Text style={styles.cityName}>{`"${cityName}"`}</Text>
      <CountryFlag countryCode={countryCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  cityNameAndFlagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  cityName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default CityNameAndFlag;
