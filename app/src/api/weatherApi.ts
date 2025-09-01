import axios from "axios";

/**
 * Fetches the current temperature of a city based on its latitude and longitude.
 * @param lat - The latitude of the city.
 * @param lon - The longitude of the city.
 * @returns A promise that resolves to the current temperature in Celsius.
 */
export const getCityTemperatureFromCoordinates = async (
  lat: Number,
  lon: Number
): Promise<number> => {
  const res = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather`
  );
  return res.data.current_weather.temperature;
};
