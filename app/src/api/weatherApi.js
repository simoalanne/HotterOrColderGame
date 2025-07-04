import axios from "axios";

/**
 * Returns a temperature for a given city name using the Open Meteo API.
 * @param {Object} params - The parameters for the API request.
 * @param {number} params.lat - The latitude of the city.
 * @param {number} params.lon - The longitude of the city.
 * @returns {Promise<number>} The current temperature in Celsius.
 */
export const getCityTemperatureFromCoordinates = async ({ lat, lon }) => {
  const res = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather`
  );
  console.log("Open Meteo API response:", res.data.current_weather);
  return res.data.current_weather.temperature;
};
