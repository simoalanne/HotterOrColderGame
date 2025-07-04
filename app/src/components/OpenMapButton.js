import { Linking, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import CustomButton from './CustomButton';

const OpenMapButton = ({ cityName }) => {
  const openMapApp = async (name) => {
    try {
      const encodedCityName = encodeURIComponent(name);
      const url =
        Platform.OS === 'ios'
          ? `maps:q=${encodedCityName}` // iOS (Apple Maps)
          : Platform.OS === 'android'
          ? `geo:0,0?q=${encodedCityName}` // Android (Google Maps)
          : `https://www.google.com/maps?q=${encodedCityName}`; // Web (Google Maps)

      await Linking.openURL(url);
    } catch (err) {
      console.error('Error opening map: ', err);
    }
  };

  return (
    <CustomButton
      label="Open map"
      onPress={() => openMapApp(cityName)}
      gradientColors={['#4CAF50', '#81C784']}
      icon={<AntDesign name="enviromento" size={20} color="white" />}
    />
  );
};

export default OpenMapButton;
