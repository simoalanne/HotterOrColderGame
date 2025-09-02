import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useStats = () => {
  const [highScore, setHighScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  // Load stored stats from AsyncStorage
  useEffect(() => {
    const loadStoredStats = async () => {
      try {
        const storedHighScore = await AsyncStorage.getItem("highScore");
        const storedTotalGames = await AsyncStorage.getItem("totalGames");
        const storedTotalPoints = await AsyncStorage.getItem("totalPoints");
        console.log("Loaded stats from storage:", {
          storedHighScore,
          storedTotalGames,
          storedTotalPoints,
        });

        setHighScore(
          storedHighScore !== null ? parseInt(storedHighScore) || 0 : 0
        );
        setTotalGames(
          storedTotalGames !== null ? parseInt(storedTotalGames) || 0 : 0
        );
        setTotalPoints(
          storedTotalPoints !== null ? parseInt(storedTotalPoints) || 0 : 0
        );
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };

    loadStoredStats();
  }, []);

  const averageScore =
    totalGames > 0 ? (totalPoints / totalGames).toFixed(2) : 0;

  const updateStats = async (newScore: number) => {
    try {
      
      await AsyncStorage.setItem(
        "highScore",
        newScore > highScore ? newScore.toString() : highScore.toString()
      );
      await AsyncStorage.setItem("totalGames", (totalGames + 1).toString());
      await AsyncStorage.setItem(
        "totalPoints",
        (totalPoints + newScore).toString()
      );
    } catch (error) {
      console.error("Error saving stats:", error);
    }
  };

  return { highScore, totalGames, averageScore, updateStats };
};

export default useStats;
