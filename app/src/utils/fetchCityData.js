import getRandomCityName from '../api/randomCityApi';
import { getWikiImagesNearCoords } from '../api/wikipediaApi';
import { getCityTemperatureFromCoordinates } from '../api/weatherApi';

export default fetchCityData = async (setProgress, shouldUpdate = true, db, retryCount = 0) => {
  try {
    console.log('Fetching city data...');
    // Step 1: Fetch random city name
    const entry = await getRandomCityName(db);
    console.log('Random city entry:', entry);

    // Run Wikipedia images fetch and temperature fetch in parallel
    const [images, temp] = await Promise.all([
      getWikiImagesNearCoords(entry.lat, entry.lon),
      getCityTemperatureFromCoordinates({ lat: entry.lat, lon: entry.lon }),
    ]);

    console.log('Wikipedia article image:', images[0]);
    console.log('City temperature:', temp);

    const obj = {
      name: entry.cityName,
      countryCode: entry.countryCode,
      lat: entry.lat,
      lon: entry.lon,
      imageURL: images[0],
      temp,
    };
    console.log('City data object:', obj);
    return obj;
  } catch (error) {
    if (retryCount > 20) {
      throw new Error('Failed to fetch city data after 20 tries');
    }

    return await fetchCityData(setProgress, shouldUpdate, db, retryCount + 1);
  }
};
