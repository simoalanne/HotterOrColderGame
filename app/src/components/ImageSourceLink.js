import { TouchableOpacity, Text, Linking, StyleSheet } from 'react-native';

const ImageSourceLink = ({ imageURL, positioning }) => {
  return (
    <TouchableOpacity style={{position: 'absolute', ...positioning}} onPress={() => Linking.openURL(imageURL)}>
      <Text style={styles.imageSourceText}>Source: Wikimedia Commons</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageSourceText: {
    color: 'white',
    fontSize: 12,
  },
});

export default ImageSourceLink;
