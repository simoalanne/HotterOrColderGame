import { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getCityNameFromCoords } from '../api/nominatimApi';
import CustomButton from './CustomButton';

const LocateMeButton = ({ onLocationFetched, onError }) => {
  const [isFetching, setIsFetching] = useState(false);

  const fetchLocation = async (latitude, longitude) => {
    try {
      const cityData = await getCityNameFromCoords(latitude, longitude);
      if (!cityData) {
        onError('No city found for the given coordinates.');
        return;
      }
      onLocationFetched({
        lat: latitude,
        lon: longitude,
        name: cityData.name,
      });
    } catch (error) {
      console.error('Error in geocoding with Nominatim:', error);
      onError('Unable to fetch location');
    }
  };

  const handleLocationPress = async () => {
    if (isFetching) return; // prevent starting multiple fetches
    setIsFetching(true);
    if (Platform.OS === 'web') {
      if (!navigator.geolocation) {
        onError('Geolocation is not supported on this browser.');
        setIsFetching(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) =>
          fetchLocation(position.coords.latitude, position.coords.longitude),
        () =>
          onError(
            'Unable to get your current location. Please ensure you have allowed this website to access your location.'
          )
      );
      setIsFetching(false);
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      onError(
        'Permission to access location was denied. Please enable it if you wish to use the geolocation.'
      );
      setIsFetching(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      fetchLocation(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Error in mobile geolocation:', error);
      onError(
        'Unable to get your current location. Please ensure that you have GPS enabled on your phone.'
      );
      setIsFetching(false);
    }

    setIsFetching(false);
  };

  return (
    <View style={styles.container}>
      <CustomButton
        onPress={handleLocationPress}
        icon={<AntDesign name="enviromento" size={24} color="white" />}
        buttonStyle={styles.locateButton}
        gradientColors={['#4682B4', '#5F9EA0']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  locateButton: {
    width: 50,
    borderRadius: 25,
  },
});

export default LocateMeButton;
