import {
  View,
  Text,
  StyleSheet,
  Platform,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import getIsNightOrDay from '../utils/getIsNightOrDay';

const MainMenu = () => {
  const navigation = useNavigation();

  const cityImage =
    getIsNightOrDay() === 'night'
      ? require('../assets/night-city.jpg')
      : require('../assets/day-city.jpg');

  return (
    <ImageBackground source={cityImage} style={styles.background}>
      <View style={styles.dialog}>
        <Text style={styles.title}>
          <Text style={styles.hotter}>Hotter</Text>{' '}
          <Text style={styles.vs}>Or</Text>{' '}
          <Text style={styles.colder}>Colder</Text>
        </Text>
        <View style={styles.instructions}>
          <Text style={styles.bullet}>• Guess if one city is hotter or colder than the other</Text>
          <Text style={styles.bullet}>
            • Use flags or open cities in {Platform.OS === 'ios' ? 'Apple' : 'Google'} Maps for help
          </Text>
          <Text style={styles.bullet}>
            • Double tap city images to hide them if distracting
          </Text>
          <Text style={styles.bullet}>
            • Only one life — wrong guess ends the game
          </Text>
        </View>
        <CustomButton
          label="Start Game"
          onPress={() => navigation.navigate('Game')}
          gradientColors={['#00BFFF', '#1E90FF', '#ADD8E6']}
        />
        <CustomButton
          label="View Stats"
          onPress={() => navigation.navigate('Stats')}
        />
        <CustomButton
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
          gradientColors={['#FFD700', '#FFA500', '#FF8C00']}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  dialog: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  hotter: {
    color: '#FFD700',
  },
  colder: {
    color: '#00BFFF',
  },
  vs: {
    color: 'white',
  },
  instructions: {
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  bullet: {
    fontSize: 16,
    color: 'white',
  },
});

export default MainMenu;
