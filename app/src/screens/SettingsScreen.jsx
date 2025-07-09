import { View, Text, ImageBackground, StyleSheet, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import getIsNightOrDay from "../utils/getIsNightOrDay";
import useSettings from "../hooks/useSettings";
import * as DB from "../api/randomCityApi";
import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

const SettingsScreen = () => {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const { settings, updateSettings } = useSettings();
  const [populationData, setPopulationData] = useState({
    minPopulation: 0,
    maxPopulation: 0,
  });
  const [availableCities, setAvailableCities] = useState(0);
  const step = 10000;

  useEffect(() => {
    (async () => {
      const dbData = await DB.getMaxAndMinPopulation(db);
      setPopulationData(dbData);
    })();
  }, []);

  // update the available cities count every time any setting changes
  useEffect(() => {
    (async () => {
      const count = await DB.getMatchingCitiesCount(db, settings);
      setAvailableCities(count);
    })();
  }, [settings, db]);

  const cityImage =
    getIsNightOrDay() === "night"
      ? require("../assets/night-city.jpg")
      : require("../assets/day-city.jpg");

  // function to handle population changes. Updates corresponding field in settings and makes sure min is always less than max and vice versa
  const onPopulationChange = (value, { isMax }) => {
    if (isMax) {
      const minCityPopulation =
        value <= settings.minCityPopulation
          ? Math.max(value - step, populationData.minPopulation)
          : settings.minCityPopulation;
      updateSettings({
        ...settings,
        maxCityPopulation: value,
        minCityPopulation,
      });
    } else {
      const maxCityPopulation =
        value >= settings.maxCityPopulation
          ? Math.min(value + step, populationData.maxPopulation)
          : settings.maxCityPopulation;
      updateSettings({
        ...settings,
        minCityPopulation: value,
        maxCityPopulation,
      });
    }
  };

  if (!settings) return;

  return (
    <ImageBackground source={cityImage} style={styles.background}>
      <View style={styles.dialogContent}>
        <Text style={styles.label}>Capital cities only?</Text>
        <Switch
          value={settings.capitalCitiesOnly}
          onValueChange={(value) =>
            updateSettings({ ...settings, capitalCitiesOnly: value })
          }
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
        <Text style={styles.label}>Min City Population {settings.minCityPopulation}</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={populationData.minPopulation}
          maximumValue={populationData.maxPopulation}
          step={step}
          value={settings.minCityPopulation}
          onSlidingComplete={(value) =>
            onPopulationChange(value, { isMax: false })
          }
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#FFFFFF"
        />
        <Text style={styles.label}>Max City Population {settings.maxCityPopulation}</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={populationData.minPopulation}
          maximumValue={populationData.maxPopulation}
          step={step}
          value={settings.maxCityPopulation}
          onSlidingComplete={(value) =>
            onPopulationChange(value, { isMax: true })
          }
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#FFFFFF"
        />
        <Text style={styles.label}>Available Cities: {availableCities}</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  dialogContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    width: "90%",
  },
  label: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SettingsScreen;
