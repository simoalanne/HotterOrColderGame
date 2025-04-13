import axios from 'axios';

/**
 * Fetches coordinates for a given city name using the Nominatim OpenStreetMap API.
 *
 * @param {string} cityName - The name of the city for which coordinates are requested.
 * @returns {Promise<Object>} A promise that resolves to an object containing latitude, longitude, city name, and display name.
 *
 * @throws {Error} If the API request fails, or if no relevant city coordinates are found.
 *
 * @note The Nominatim API returns results based on relevance, meaning if the city name is also a popular landmark,
 *       company, or other notable entity, the API might return coordinates that correspond to those locations
 *       instead of the intended city. This can lead to unexpected results.
 *       For example, if a city shares its name with a major company or landmark, the API might return coordinates
 *       for the company or landmark rather than the city itself.
 *       The API does not provide a perfect mechanism to distinguish between different entities that share the same name,
 *       so it's bit random if this returns a city or other entity. Luckily most of the time cities are the most
 *       relevant result so this API works well 99% of the time for this app.
 */
export const getCoordinatesFromCityName = async (cityName) => {
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/search?city=${cityName}&format=json`,
      {
        headers: {
          'User-Agent': 'WeatherApp', // Nominatim API requires user-agent header for the API to respond correctly
          'Accept-Language': 'en', // For always getting the international name
        },
      }
    );

    const data = res.data[0];
    if (data) {
      return {
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lon),
        name: data.name,
        displayName: data.display_name,
      };
    }

    throw new Error(`No coordinates found for city: ${cityName}`);
  } catch (error) {
    throw new Error(
      `Failed to fetch coordinates for city: ${cityName}. ${error.message}`
    );
  }
};

/**
 * Fetches corresponding city to the given latitude and longitude using the Nominatim OpenStreetMap API.
 *
 * @param {number} lat - The latitude of the location to reverse geocode.
 * @param {number} lon - The longitude of the location to reverse geocode.
 * @returns {Promise<Object>} A promise that resolves to an object containing the city name, latitude, and longitude.
 *
 * @throws {Error} If the API request fails or if no city information can be determined for the provided coordinates.
 *
 * @note The Nominatim API can return multiple address components, but this function will prioritize city, town, or village names.
 */
export const getCityNameFromCoords = async (lat, lon) => {
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'WeatherApp', // Nominatim API requires user-agent header for the API to respond correctly
          'Accept-Language': 'en', // For always getting the international name
        },
      }
    );

    const data = res.data.address;
    const city = data.city || data.town || data.village;

    if (city) {
      return {
        lat,
        lon,
        name: city,
      };
    }

    throw new Error('City not found for the given coordinates');
  } catch (error) {
    throw new Error(`Failed to reverse geocode coordinates: ${error.message}`);
  }
};
