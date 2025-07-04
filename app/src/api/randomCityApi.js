/**
 * Fetches a random city name from the database.
 * This function retrieves a random city entry from the 'cities' table in the database.
 * @param {Object} db - the database instance to query.
 * @returns {Promise<Object>} A promise that resolves to an object containing the city name, country code, latitude, and longitude.
 * @throws {Error} If the database query fails or if no city entries are found.
 */
export default getRandomCityName = async (db) => {
  const randomEntry = (await db.getAllAsync(`SELECT * FROM cities ORDER BY RANDOM() LIMIT 1`))[0];
  return { cityName: randomEntry.city_name, countryCode: randomEntry.country_code, lat: randomEntry.latitude, lon: randomEntry.longitude };
};
