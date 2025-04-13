import getRandomCityName from '../api/randomCityApi';
import { getCoordinatesFromCityName } from '../api/nominatimApi';
import {
  getWikiArticleTitleFromCoords,
  getWikiArticleImageFromTitle,
} from '../api/wikipediaApi';
import { getCityTemperatureFromCoordinates } from '../api/openWeatherMapApi';

const updateProgress = (setProgress, shouldUpdate, increment) => {
  if (shouldUpdate) {
    setProgress((prevProgress) => Math.min(prevProgress + increment, 100));
  }
};

export default fetchCityData = async (setProgress, shouldUpdate = true, retryCount = 0) => {
  try {
    // Step 1: Fetch random city name
    const randomCityName = await getRandomCityName();
    updateProgress(setProgress, shouldUpdate, 20);

    // Step 2: Fetch coordinates for the city
    const { lat, lon, name, displayName } = await getCoordinatesFromCityName(
      randomCityName
    );
    updateProgress(setProgress, shouldUpdate, 20);

    // Step 3: Fetch Wikipedia article title
    const articleTitle = await getWikiArticleTitleFromCoords(lat, lon, name);
    updateProgress(setProgress, shouldUpdate, 20);

    // Step 4: Fetch image URL from Wikipedia
    const imageURL = await getWikiArticleImageFromTitle(articleTitle);
    updateProgress(setProgress, shouldUpdate, 20);

    // Step 5: Fetch temperature data
    const { temp, countryCode } = await getCityTemperatureFromCoordinates({
      lat,
      lon,
    });
    updateProgress(setProgress, shouldUpdate, 20);

    return { lat, lon, name, imageURL, temp, countryCode, displayName };
  } catch (error) {
    if (retryCount > 20) {
      throw new Error('Failed to fetch city data after 20 tries');
    }

    return await fetchCityData(setProgress, shouldUpdate, retryCount + 1);
  }
};
