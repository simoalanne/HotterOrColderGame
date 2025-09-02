import { SQLiteDatabase } from "expo-sqlite";
import type { Settings } from "../hooks/useSettings";

type CityEntryDb = {
  id: number;
  city_name: string;
  country_code: string;
  latitude: number;
  longitude: number;
};

type CityEntry = {
  id: number;
  cityName: string;
  countryCode: string;
  lat: number;
  lon: number;
};

const buildWhereClause = (
  settings: Settings,
  alreadyIncludedIds: string[] = []
) => {
  const whereClauses = [];
  const params = [];

  whereClauses.push(`population >= ?`);
  params.push(settings.minCityPopulation);

  if (settings.maxCityPopulation >= 0) {
    whereClauses.push(`population <= ?`);
    params.push(settings.maxCityPopulation);
  }

  if (settings.capitalCitiesOnly) {
    whereClauses.push(`is_capital = 1`);
  }

  if (settings.includedCountries.length > 0) {
    const placeholders = settings.includedCountries.map(() => "?").join(",");
    whereClauses.push(`country_code IN (${placeholders})`);
    params.push(...settings.includedCountries);
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

export const getRandomCityName = async (
  db: SQLiteDatabase,
  settings: Settings,
  alreadyIncludedIds: string[]
): Promise<CityEntry | null> => {
  const { whereClause, params } = buildWhereClause(
    settings,
    alreadyIncludedIds
  );
  console.log(
    "Where clause:",
    whereClause,
    "Params:",
    params,
    "settings:",
    settings
  );
  const query = `SELECT * FROM cities ${whereClause} ORDER BY RANDOM() LIMIT 1`;
  const [randomEntry]: CityEntryDb[] = await db.getAllAsync(query, params);
  if (!randomEntry) return null;
  return {
    id: randomEntry.id,
    cityName: randomEntry.city_name,
    countryCode: randomEntry.country_code,
    lat: randomEntry.latitude,
    lon: randomEntry.longitude,
  };
};

export const getMatchingCitiesCount = async (
  db: SQLiteDatabase,
  settings: Settings
) => {
  const { whereClause, params } = buildWhereClause(settings);
  const query = `SELECT COUNT(*) as count FROM cities ${whereClause}`;
  const [result]: { count: number }[] = await db.getAllAsync(query, params);
  console.log("Matching cities count:", result.count);
  return result.count;
};

export const getMaxAndMinPopulation = async (db: SQLiteDatabase) => {
  const query = `SELECT MAX(population) as maxPopulation, MIN(population) as minPopulation FROM cities WHERE population > 0`;
  const [result]: { maxPopulation: number; minPopulation: number }[] =
    await db.getAllAsync(query);
  return result;
};

export const getAllCountries = async (
  db: SQLiteDatabase
): Promise<string[]> => {
  const query = `SELECT DISTINCT country from cities ORDER BY country`;
  const countries: { country_code: string }[] = await db.getAllAsync(query);
  return countries.map((country) => country.country_code);
};
