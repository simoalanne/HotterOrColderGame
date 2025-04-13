import { Image, StyleSheet } from 'react-native';

const CountryFlag = ({ customStyles, countryCode }) => {
  return (
    <Image
      source={{
        uri: `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`,
      }}
      style={[styles.flagStyle, customStyles]}
    />
  );
};

const styles = StyleSheet.create({
  flagStyle: {
    width: 40,
    height: (40 * 2) / 3,
  },
});
export default CountryFlag;
