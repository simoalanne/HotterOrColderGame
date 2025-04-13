import axios from 'axios';

/**
 * Fetches a random city name from an external API.
 *
 * @returns {Promise<string>} A promise that resolves to a random city name.
 *
 * @throws {Error} If the API request fails, or if no city name is found in the response.
 *
 * @note This function relies on the `https://random-city-api.vercel.app/api/random-city` API, which has several limitations:
 *       - The API sometimes returns invalid or unexpected results due to encoding issues or incomplete city names.
 *       - The city names returned by the API may not always match real, well-known cities.
 *       - The API may return a city that no longer exists, has no weather data, or lacks relevant information.
 *       While this API provides a random city name, better curated list of cities would be better suited for this app.
 */
export default getRandomCityName = async () => {
  try {
    const res = await axios.get(
      'https://random-city-api.vercel.app/api/random-city'
    );

    if (!res.data.city) {
      throw new Error('No city name found in response.');
    }

    return res.data.city;
  } catch (error) {
    throw new Error(`Failed to fetch a random city: ${error.message}`);
  }
};
