import { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Bar } from 'react-native-progress';
import CustomButton from './CustomButton';
import { AntDesign } from '@expo/vector-icons';
import getIsNightOrDay from '../utils/getIsNightOrDay';

const GameStartScreen = ({
  onGameStart,
  loadingProgress,
  loading,
  highScore,
  totalGames,
  avgScore,
  error,
}) => {
  const [viewStats, setViewStats] = useState(false);

  const cityImage =
    getIsNightOrDay() === 'night'
      ? require('../assets/night-city.png')
      : require('../assets/day-city.png');

  return (
    <ImageBackground source={cityImage} style={styles.startBackground}>
      <View style={styles.dialogContent}>
        {viewStats ? (
          <View style={styles.statsContainer}>
            <TouchableOpacity
              onPress={() => setViewStats(false)}
              style={styles.backArrow}>
              <AntDesign name="arrowleft" size={36} color="white" />
            </TouchableOpacity>
            <Text style={styles.statsText}>Total Games: {totalGames}</Text>
            <Text style={styles.statsText}>High Score: {highScore}</Text>
            <Text style={styles.statsText}>Average Score: {avgScore}</Text>
          </View>
        ) : (
          <View style={styles.mainMenu}>
            <Text style={styles.titleText}>
              <Text style={styles.hotterText}>Hotter</Text>{' '}
              <Text style={styles.vsText}>VS</Text>{' '}
              <Text style={styles.colderText}>Colder</Text>
            </Text>

            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTextBullet}>
                • Guess whether the city’s temperature is hotter or colder than
                the other
              </Text>
              <Text style={styles.instructionsTextBullet}>
                • Use flags or open the city in{' '}
                {Platform.OS === 'ios' ? 'Apple' : 'Google'} maps for hints
              </Text>
              <Text style={styles.instructionsTextBullet}>
                • Double tap the images to hide them if they're distracting or
                have bad contrast
              </Text>
              <Text style={styles.instructionsTextBullet}>
                • Only one life, guess wrong and the game is over
              </Text>
            </View>
            {loading && (
              <Bar
                progress={loadingProgress / 100}
                width={200}
                height={15}
                color="#00BFFF"
                unfilledColor="#e0e0e0"
              />
            )}
            <CustomButton
              label="Start Game"
              disabled={loading}
              onPress={async () => {
                await onGameStart();
              }}
              gradientColors={['#00BFFF', '#1E90FF', '#ADD8E6']}
            />
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            <CustomButton
              label="View Stats"
              onPress={() => setViewStats(true)}
            />
          </View>
        )}
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
  mainMenu: {
    alignItems: 'center',
  },
  dialogContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    width: '90%',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  hotterText: {
    color: '#FFD700',
  },
  colderText: {
    color: '#00BFFF',
  },
  vsText: {
    color: 'white',
  },
  instructionsContainer: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  instructionsTextBullet: {
    fontSize: 16,
    color: 'white',
  },
  statsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backArrow: {
    marginBottom: 20,
  },
  statsText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 25,
    width: 200,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
  },
});

export default GameStartScreen;
