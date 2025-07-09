import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "settings";

const DEFAULT_SETTINGS = {
  gameMode: "temperature",
  // the min and max are same what db will return assuming the db file is the one provided in the repo
  minCityPopulation: 4,
  maxCityPopulation: 37785000,
  capitalCitiesOnly: false,
  includedCountries: [], // by default, all countries are included
};

const useSettings = () => {
  const [settings, setSettings] = useState();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_KEY);
        if (stored) {
          setSettings(JSON.parse(stored));
        } else {
          await setDefaults();
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const setDefaults = async () => {
    // settings for the game
    await updateSettings(DEFAULT_SETTINGS);
  };

  return { settings, updateSettings };
};

export default useSettings;
