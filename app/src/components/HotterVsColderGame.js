import { useState } from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import useAnimatedNumber from '../hooks/useAnimatedNumber';
import fetchCityData from '../utils/fetchCityData';
import ImageSourceLink from './ImageSourceLink';
import VSCircle from './VSCircle';
import OpenMapButton from './OpenMapButton';
import CityNameAndFlag from './CityNameAndFlag';
import GameButtons from './GameButtons';
import { Bar } from 'react-native-progress';
import useStats from '../hooks/useStats';
import GameStartScreen from './GameStartScreen';
import { useSQLiteContext } from 'expo-sqlite';

const HotterVsColderGame = () => {
  const db = useSQLiteContext();
  const [cityData, setCityData] = useState({
    reference: null,
    guessed: null,
  });
  const { highScore, totalGames, averageScore, updateStats } = useStats();
  const [error, setError] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guessedTempVisible, setGuessedTempVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [guessButtonsDisabled, setGuessButtonsDisabled] = useState(false);
  const [showBackgroundImages, setShowBackgroundImages] = useState({
    reference: true,
    guessed: true,
  });
  const { animatedTemp, animateTo } = useAnimatedNumber();
  const updateCityData = async ({
    isGuessedCity = false,
    swapReferenceToGuessed = false,
    shouldUpdate = true,
  }) => {
    setLoading(true);
    setError('');
    try {
      const newCityData = await fetchCityData(
        setLoadingProgress,
        shouldUpdate,
        db
      );
      console.log('New city data:', newCityData);

      setCityData((prev) => ({
        reference: swapReferenceToGuessed
          ? prev.guessed
          : isGuessedCity
            ? prev.reference
            : newCityData,
        guessed: isGuessedCity ? newCityData : prev.guessed,
      }));

      setShowBackgroundImages((prev) => ({ ...prev, guessed: true }));
    } catch (err) {
      throw new Error();
    } finally {
      setLoading(false);
      setGuessButtonsDisabled(false);
      setGuessedTempVisible(false);
      setIsCorrect(null);
    }
  };
  const guessHigherOrLower = async (guess) => {
    setGuessButtonsDisabled(true);
    setGuessedTempVisible(true);
    await animateTo(cityData.guessed.temp);

    const correct =
      (guess === 'higher' && cityData.guessed.temp > cityData.reference.temp) ||
      (guess === 'lower' && cityData.guessed.temp <= cityData.reference.temp);

    setIsCorrect(correct);
    setScore((prev) => (correct ? prev + 1 : prev));
  };

  const startGame = async () => {
    try {
      await Promise.all([
        updateCityData({ isGuessedCity: false, shouldUpdate: false }),
        updateCityData({ isGuessedCity: true }),
      ]);
      setScore(0);
      setGameStarted(true);
    } catch (err) {
      setError('Something went wrong. Please try again!');
    }
  };

  const createDoubleTapGesture = (imageType) =>
    Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(() => {
        setShowBackgroundImages((prev) => ({
          ...prev,
          [imageType]: !prev[imageType],
        }));
      });

  const doubleTapReference = createDoubleTapGesture('reference');
  const doubleTapGuessed = createDoubleTapGesture('guessed');
  return (
    <View style={styles.container}>
      {/* Game start screen */}
      {!gameStarted ? (
        <GameStartScreen
          onGameStart={startGame}
          loadingProgress={loadingProgress}
          loading={loading}
          highScore={highScore}
          totalGames={totalGames}
          avgScore={averageScore}
          error={error}
        />
      ) : (
        <>
          {/* Reference City Display */}
          <GestureDetector gesture={doubleTapReference}>
            <ImageBackground
              source={
                showBackgroundImages.reference && {
                  uri: cityData.reference.imageURL,
                }
              }
              style={[
                styles.cityBackground,
                !showBackgroundImages.reference && {
                  backgroundColor: '#121212',
                },
              ]}
              imageStyle={styles.cityImage}>
              <View style={styles.cityOverlay}>
                <CityNameAndFlag
                  cityName={cityData.reference.name}
                  countryCode={cityData.reference.countryCode}
                />
                <Text style={styles.tempText}>{'Temperature is'}</Text>
                <Text
                  style={[
                    styles.largeTempText,
                    {
                      color: cityData.reference.temp > 0 ? 'gold' : '#00BFFF',
                    },
                  ]}>
                  {cityData.reference.temp.toFixed(2)}°C
                </Text>
                <OpenMapButton cityName={cityData.reference.name} />
              </View>
              <ImageSourceLink
                imageURL={cityData.reference.imageURL}
                positioning={{ top: 5, left: 5 }}
              />
            </ImageBackground>
          </GestureDetector>
          <VSCircle isCorrect={isCorrect} />
          {/* Guessed City Display */}
          <GestureDetector gesture={doubleTapGuessed}>
            <ImageBackground
              source={
                showBackgroundImages.guessed && {
                  uri: cityData.guessed.imageURL,
                }
              }
              style={[
                styles.cityBackground,
                !showBackgroundImages.guessed && {
                  backgroundColor: '#121212',
                },
              ]}
              imageStyle={styles.cityImage}>
              <View style={styles.cityOverlay}>
                {loading ? (
                  <Bar
                    progress={loadingProgress / 100}
                    width={200}
                    height={15}
                    color="#00ef00"
                    unfilledColor="#e0e0e0"
                  />
                ) : (
                  <>
                    <CityNameAndFlag
                      cityName={cityData.guessed.name}
                      countryCode={cityData.guessed.countryCode}
                    />
                    <Text style={styles.tempText}>{'Temperature is'}</Text>
                    {guessedTempVisible && (
                      <Text
                        style={[
                          styles.largeTempText,
                          {
                            color:
                              cityData.guessed.temp > 0 ? 'gold' : '#00BFFF',
                          },
                        ]}>
                        {`${animatedTemp.toFixed(2)} °C`}
                      </Text>
                    )}
                  </>
                )}
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
                <GameButtons
                  disabled={loading}
                  isGuessButtonsEnabled={!guessButtonsDisabled}
                  onGuess={guessHigherOrLower}
                  onQuit={async () => {
                    await updateStats(score);
                    setLoadingProgress(0);
                    setGameStarted(false);
                    setShowBackgroundImages((prev) => ({
                      ...prev,
                      guessed: true,
                      reference: true,
                    }));
                  }}
                  onNextCity={() => {
                    setLoadingProgress(0);
                    updateCityData({
                      isGuessedCity: true,
                      swapReferenceToGuessed: true,
                    });
                  }}
                  isCorrect={isCorrect}
                  guessedCityName={cityData.guessed.name}
                />
              </View>
              <ImageSourceLink
                imageURL={cityData.guessed.imageURL}
                positioning={{ bottom: 5, left: 5 }}
              />
            </ImageBackground>
          </GestureDetector>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f9',
  },
  cityBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    zIndex: 0,
  },
  cityImage: {
    filter: 'brightness(50%)',
  },
  cityOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempText: {
    fontSize: 15,
    color: 'white',
  },
  largeTempText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'gold',
  },
  scoreText: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
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

export default HotterVsColderGame;
