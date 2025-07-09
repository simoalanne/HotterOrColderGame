const buildWhereClause = (settings = {}) => {
  const {
    minCityPopulation = 0,
    maxCityPopulation = -1,
    capitalCitiesOnly = false,
    includedCountries = [],
    alreadyIncludedIds = [],
  } = settings;

  const whereClauses = [];
  const params = [];

  whereClauses.push(`population >= ?`);
  params.push(minCityPopulation);

  if (maxCityPopulation >= 0) {
    whereClauses.push(`population <= ?`);
    params.push(maxCityPopulation);
  }

  if (capitalCitiesOnly) {
    whereClauses.push(`is_capital = 1`);
  }

  if (includedCountries.length > 0) {
    const placeholders = includedCountries.map(() => "?").join(",");
    whereClauses.push(`country_code IN (${placeholders})`);
    params.push(...includedCountries);
  }

  if (alreadyIncludedIds?.length > 0) {
    const placeholders = alreadyIncludedIds.map(() => "?").join(",");
    whereClauses.push(`id NOT IN (${placeholders})`);
    params.push(...alreadyIncludedIds);
  }

  const whereClause = whereClauses.length
    ? `WHERE ${whereClauses.join(" AND ")}`
    : "";

  return { whereClause, params };
};

/**
 * Fetches a random city name from the database based on the provided settings.
 * @param {Object} db - The database connection object.
 * @param {Object} settings - The settings object containing filters for the query.
 * @return {Promise<Object|null>} - A promise that resolves to an object containing city details or null if no city matches the criteria.
 */
export const getRandomCityName = async (db, settings, alreadyIncludedIds) => {
  const { whereClause, params } = buildWhereClause(settings, alreadyIncludedIds);
  console.log("Where clause:", whereClause, "Params:", params, "settings:", settings);
  const query = `SELECT * FROM cities ${whereClause} ORDER BY RANDOM() LIMIT 1`;
  const [randomEntry] = await db.getAllAsync(query, params);
  if (!randomEntry) return null;
  return {
    cityName: randomEntry.city_name,
    countryCode: randomEntry.country_code,
    lat: randomEntry.latitude,
    lon: randomEntry.longitude,
  };
};

export const getMatchingCitiesCount = async (db, settings) => {
  const { whereClause, params } = buildWhereClause(settings);
  const query = `SELECT COUNT(*) as count FROM cities ${whereClause}`;
  const [result] = await db.getAllAsync(query, params);
  return result ? result.count : 0;
};

export const getMaxAndMinPopulation = async (db) => {
  const query = `SELECT MAX(population) as maxPopulation, MIN(population) as minPopulation FROM cities WHERE population > 0`;
  const [result] = await db.getAllAsync(query);
  console.log("Max and Min Population:", result);
  return result;
};

export const getAllCountries = async (db) => {
  const query = `SELECT DISTINCT country from cities ORDER BY country`;
  const countries = await db.getAllAsync(query);
  return countries.map((country) => country.country_code);
};
