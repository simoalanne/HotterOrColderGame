import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStats = () => {
  const [highScore, setHighScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  // Load stored stats from AsyncStorage
  useEffect(() => {
    const loadStoredStats = async () => {
      try {
        const storedHighScore = await AsyncStorage.getItem('highScore');
        const storedTotalGames = await AsyncStorage.getItem('totalGames');
        const storedTotalPoints = await AsyncStorage.getItem('totalPoints');

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
        console.error('Error loading stats:', error);
      }
    };

    loadStoredStats();
  }, []);

  const averageScore = totalGames > 0 ? (totalPoints / totalGames).toFixed(2) : 0;

  const updateStats = async (newScore) => {
    try {
      const updatedTotalGames = totalGames + 1;
      const updatedTotalPoints = totalPoints + newScore;

      setTotalGames(updatedTotalGames);
      setTotalPoints(updatedTotalPoints);

      if (newScore > highScore) {
        setHighScore(newScore);
      }

      // Save updated values to AsyncStorage
      await AsyncStorage.setItem('highScore', highScore.toString());
      await AsyncStorage.setItem('totalGames', updatedTotalGames.toString());
      await AsyncStorage.setItem('totalPoints', updatedTotalPoints.toString());
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  return { highScore, totalGames, averageScore, updateStats };
};

export default useStats;
