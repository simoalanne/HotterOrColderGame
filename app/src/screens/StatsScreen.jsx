import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useStats from '../hooks/useStats';
import getIsNightOrDay from '../utils/getIsNightOrDay';

const StatsScreen = () => {
  const navigation = useNavigation();
  const { highScore, totalGames, averageScore } = useStats();

  const cityImage =
    getIsNightOrDay() === 'night'
      ? require('../assets/night-city.jpg')
      : require('../assets/day-city.jpg');

  return (
    <ImageBackground source={cityImage} style={styles.startBackground}>
      <View style={styles.dialogContent}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Total Games: {totalGames}</Text>
          <Text style={styles.statsText}>High Score: {highScore}</Text>
          <Text style={styles.statsText}>Average Score: {averageScore}</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  startBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  dialogContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    width: '90%',
  },
  statsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backArrow: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  statsText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
});

export default StatsScreen;
