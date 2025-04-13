import axios from 'axios';

/**
 * Fetches the current temperature for a given set of coordinates using the OpenWeatherMap API
 * or alternatively a custom API URL. When creating production build of the app it's highly recommended
 * not to expose api keys in the environment variables as anyone can see them in the app bundle quite easily.
 * Therefore, you can specify a custom API URL in the environment variable that would be your own backend
 * or proxy, serverless function, etc. that would handle the request to the OpenWeatherMap API and return the data
 * in the same format as the OpenWeatherMap API would.
 *
 * @param {Object} coordinates - An object containing the latitude and longitude.
 * @param {number} coordinates.lat - The latitude of the location.
 * @param {number} coordinates.lon - The longitude of the location.
 * @returns {Promise<Object>} A promise that resolves to an object containing the temperature (in Celsius) and country code.
 *
 * @throws {Error} If the API request fails, or if there is an issue fetching the temperature data.
 */
export const getCityTemperatureFromCoordinates = async ({ lat, lon }) => {
  try {
    const res = await axios.get(
      process.env.EXPO_PUBLIC_TEMPERATURE_API_URL || 'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lat: lat,
          lon: lon,
          // this is send for the custom url too but it can just be ignored
          // it should be undefined anyway if custom url is used
          appid: process.env.EXPO_PUBLIC_OPEN_WEATHER_MAP_API_KEY,
          units: 'metric',
        },
      }
    );
    return {
      temp: res.data.main.temp,
      countryCode: res.data.sys.country,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch city temperature for coordinates (${lat}, ${lon}). ${error.message}`
    );
  }
};

/**
 * Fetches the 5-day weather forecast for a given city using the OpenWeatherMap API
 * or alternatively a custom API URL. When creating production build of the app it's highly recommended
 * not to expose api keys in the environment variables as anyone can see them in the app bundle quite easily.
 * Therefore, you can specify a custom API URL in the environment variable that would be your own backend
 * or proxy, serverless function, etc. that would handle the request to the OpenWeatherMap API and return the data
 * in the same format as the OpenWeatherMap API would.
 *
 * @param {string} cityName - The name of the city to fetch the weather forecast for.
 * @returns {Promise<Object>} A promise that resolves to the weather forecast data.
 *
 * @throws {Error} If the API request fails or there is an issue fetching the forecast data.
 */
export const getWeeklyForecast = async (cityName) => {
  try {
    const res = await axios.get(
      process.env.EXPO_PUBLIC_FORECAST_API_URL || 'https://api.openweathermap.org/data/2.5/forecast',
      {
        params: {
          q: cityName,
          // this is send for the custom url too but it can just be ignored
          // it should be undefined anyway if custom url is used
          appid: process.env.EXPO_PUBLIC_OPEN_WEATHER_MAP_API_KEY,
          units: 'metric',
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message // if exists has "city not found"
        ? 'City not found. Please check the input or try again! '
        : 'Something went wrong. Please try again!' // if the issues wasnt with invalid city send general message
    );
  }
};
