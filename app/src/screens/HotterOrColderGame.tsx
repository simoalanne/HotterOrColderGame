import { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import useAnimatedNumber from "../hooks/useAnimatedNumber";
import fetchCityData from "../utils/fetchCityData";
import ImageSourceLink from "../components/ImageSourceLink";
import VSCircle from "../components/VSCircle";
import OpenMapButton from "../components/OpenMapButton";
import CityNameAndFlag from "../components/CityNameAndFlag";
import GameButtons from "../components/GameButtons";
import { Bar } from "react-native-progress";
import useStats from "../hooks/useStats";
import { useSQLiteContext } from "expo-sqlite";
import useSettings from "../hooks/useSettings";
import { useNavigation } from "@react-navigation/native";
import { VSState } from "../components/VSCircle";
import type { MainMenuNavigationProp } from "./MainMenu";
import CityCard from "../components/CityCard";

type CityData = {
  name: string;
  countryCode: string;
  lat: number;
  lon: number;
  imageURL: string | null;
  temp: number;
};

type GameState = {
  reference: CityData | null;
  guessed: CityData | null;
};

const HotterOrColderGame = () => {
  const db = useSQLiteContext();
  const navController = useNavigation<MainMenuNavigationProp>();
  const { settings } = useSettings();
  const [cityData, setCityData] = useState<GameState>({
    reference: null,
    guessed: null,
  });
  const { updateStats } = useStats();
  const [error, setError] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [guessedTempVisible, setGuessedTempVisible] = useState(false);
  const [answerState, setAnswerState] = useState<VSState>("Neutral");
  const [guessButtonsDisabled, setGuessButtonsDisabled] = useState(false);
  const [showBackgroundImages, setShowBackgroundImages] = useState({
    reference: true,
    guessed: true,
  });

  const { animatedTemp, animateTo } = useAnimatedNumber();
  useEffect(() => {
    if (!settings) return;
    startGame();
  }, [settings]);

  const updateCityData = async ({
    isGuessedCity = false,
    swapReferenceToGuessed = false,
    shouldUpdate = true,
  }) => {
    setLoading(true);
    setError("");
    try {
      const newCityData = await fetchCityData(
        setLoadingProgress,
        shouldUpdate,
        db,
        settings
      );

      setCityData((prev) => ({
        reference: swapReferenceToGuessed
          ? prev.guessed
          : isGuessedCity
          ? prev.reference
          : newCityData,
        guessed: isGuessedCity ? newCityData : prev.guessed,
      }));

      setShowBackgroundImages((prev) => ({ ...prev, guessed: true }));
    } catch {
      setError("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
      setGuessButtonsDisabled(false);
      setGuessedTempVisible(false);
      setAnswerState("Neutral");
    }
  };

  const startGame = async () => {
    try {
      await Promise.all([
        updateCityData({ isGuessedCity: false, shouldUpdate: false }),
        updateCityData({ isGuessedCity: true }),
      ]);
      setScore(0);
    } catch {
      setError("Something went wrong. Please try again!");
    }
  };

  const guessHigherOrLower = async (guess: "higher" | "lower") => {
    setGuessButtonsDisabled(true);
    setGuessedTempVisible(true);
    if (!cityData.guessed || !cityData.reference) return;
    await animateTo(cityData.guessed.temp);

    const correct =
      (guess === "higher" && cityData.guessed.temp > cityData.reference.temp) ||
      (guess === "lower" && cityData.guessed.temp <= cityData.reference.temp);

    setAnswerState(correct ? "Correct" : "Incorrect");
    setScore((prev) => (correct ? prev + 1 : prev));
  };

  return (
    <View style={styles.container}>
      {/* Reference City Display */}
      <CityCard imageURL={cityData.reference?.imageURL || null}>
        <CityNameAndFlag
          cityName={cityData.reference?.name || "Loading..."}
          countryCode={cityData.reference?.countryCode || ""}
        />
        <Text style={styles.tempText}>Temperature is</Text>
        <Text
          style={[
            styles.largeTempText,
            {
              color:
                cityData.reference?.temp && cityData.reference.temp > 0
                  ? "gold"
                  : "#00BFFF",
            },
          ]}
        >
          {cityData.reference?.temp
            ? `${cityData.reference.temp.toFixed(2)} °C`
            : "Loading..."}
        </Text>
        <OpenMapButton cityName={cityData.reference?.name || ""} />
        <Text style={styles.scoreText}>Score: {score}</Text>
        <ImageSourceLink
          imageURL={cityData.reference?.imageURL || ""}
          positioning={{ top: 5, left: 5 }}
        />
      </CityCard>
      <VSCircle state={answerState} />
      {/* Guessed City Display */}
      <CityCard imageURL={cityData.guessed?.imageURL || null}>
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
            cityData.guessed && (
              <>
                <CityNameAndFlag
                  cityName={cityData.guessed.name}
                  countryCode={cityData.guessed.countryCode}
                />
                <Text style={styles.tempText}>Temperature is</Text>
                {guessedTempVisible && (
                  <Text
                    style={[
                      styles.largeTempText,
                      {
                        color: cityData.guessed.temp > 0 ? "gold" : "#00BFFF",
                      },
                    ]}
                  >
                    {`${animatedTemp.toFixed(2)} °C`}
                  </Text>
                )}
              </>
            )
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
              navController.navigate("MainMenu");
            }}
            onNextCity={() => {
              setLoadingProgress(0);
              updateCityData({
                isGuessedCity: true,
                swapReferenceToGuessed: true,
              });
            }}
            isCorrect={
              answerState === "Correct"
                ? true
                : answerState === "Incorrect"
                ? false
                : null
            }
            guessedCityName={cityData.guessed?.name}
          />
        </View>
        <ImageSourceLink
          imageURL={cityData.guessed?.imageURL || ""}
          positioning={{ top: 5, left: 5 }}
        />
      </CityCard>
      <Text style={styles.scoreText}>Score: {score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f9",
  },
  cityBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
    zIndex: 0,
  },
  cityImage: {
    filter: "brightness(50%)",
  },
  cityOverlay: {
    justifyContent: "center",
    alignItems: "center",
  },
  tempText: {
    fontSize: 15,
    color: "white",
  },
  largeTempText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "gold",
  },
  scoreText: {
    position: "absolute",
    top: 5,
    right: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 25,
    width: 200,
  },
  errorText: {
    textAlign: "center",
    fontSize: 14,
    color: "white",
  },
});

export default HotterOrColderGame;
