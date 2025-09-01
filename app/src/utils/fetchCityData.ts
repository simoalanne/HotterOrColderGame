import * as DB from "../api/randomCityApi";
import { getWikiImagesNearCoords } from "../api/wikipediaApi";
import { getCityTemperatureFromCoordinates } from "../api/weatherApi";
import { SQLiteDatabase } from "expo-sqlite";
import type { Settings } from "../hooks/useSettings";

const fetchCityData = async (
  setProgress: (progress: number) => void,
  shouldUpdate = true,
  db: SQLiteDatabase,
  settings: Settings,
  alreadyIncludedIds: string[] = [],
  retryCount = 0
) => {
  try {
    console.log("Fetching city data...");
    // Step 1: Fetch random city name
    const entry = await DB.getRandomCityName(db, settings, alreadyIncludedIds);
    console.log("Random city entry:", entry);
    if (!entry) {
      throw new Error("No city found matching the criteria");
    }

    // Run Wikipedia images fetch and temperature fetch in parallel
    const [images, temp] = await Promise.all([
      getWikiImagesNearCoords(entry.lat, entry.lon),
      getCityTemperatureFromCoordinates(entry.lat, entry.lon),
    ]);

    console.log("Fetched images:", images, "Temperature:", temp);

    console.log("City temperature:", temp);
    if (!images || images.length === 0) {
      throw new Error("No images found for the city");
    }

    const obj = {
      name: entry.cityName,
      countryCode: entry.countryCode,
      lat: entry.lat,
      lon: entry.lon,
      // take random image from the images array
      imageURL: images[Math.floor(Math.random() * images.length)],
      temp,
    };
    console.log("City data object:", obj);
    return obj;
  } catch (error) {
    if (retryCount > 5) {
      throw new Error("Failed to fetch city data after 20 tries");
    }

    return await fetchCityData(
      setProgress,
      shouldUpdate,
      db,
      settings,
      alreadyIncludedIds,
      retryCount + 1
    );
  }
};

export default fetchCityData;
