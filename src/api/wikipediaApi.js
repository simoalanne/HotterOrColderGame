import axios from 'axios';

/**
 * Fetches the most relevant Wikipedia article title corresponding to given latitude,
 * longitude, and city name.
 *
 * @param {number} lat - The latitude of the city.
 * @param {number} lon - The longitude of the city.
 * @param {string} cityName - The name of the city.
 * @returns {Promise<string>} The title of the most relevant Wikipedia article.
 *
 * @throws {Error} If no articles are found or an error occurs during the request.
 *
 * @note Uses the GeoSearch endpoint of the Wikipedia API to retrieve articles within a specified radius (10km)
 *       of the given coordinates. If no exact match for the city name is found, it attempts to match titles
 *       starting with the city name. If no relevant results are found, an error will be thrown.
 */
export const getWikiArticleTitleFromCoords = async (lat, lon, cityName) => {
  try {
    const res = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        list: 'geosearch',
        gscoord: `${lat}|${lon}`,
        gsradius: 10000, // Coordinates within a 10km radius
        gslimit: 20, // Maximum number of results to include
        origin: '*',
      },
    });

    // Search for exact city name match first, fallback to articles starting with city name.
    // finally fallback to first result or if no result assign null
    const geoSearchResult =
      res.data.query.geosearch.find(
        (searched) => searched.title === cityName
      ) ||
      res.data.query.geosearch.find((searched) =>
        searched.title.startsWith(cityName)
      ) ||
      (res.data.query.geosearch.length > 0
        ? res.data.query.geosearch[0]
        : null);

    if (!geoSearchResult) {
      throw new Error(`No relevant article found for city: ${cityName}`);
    }

    return geoSearchResult.title;
  } catch (error) {
    throw new Error(
      `Failed to fetch GeoSearch data for ${cityName}: ${error.message}`
    );
  }
};

/**
 * Fetches the image URL corresponding to the given Wikipedia article title.
 *
 * @param {string} wikiArticleTitle - The title of the Wikipedia article.
 * @returns {Promise<string>} A promise that resolves to the image URL or null if no image is found or an error occurs.
 *
 * @throws {Error} If the API request fails or if no image is found for the given article.
 *
 * @note The image URL returned by this function is sourced from Wikimedia Commons, which often includes
 *       images of city coats of arms, logos, or maps of the area, rather than typical cityscapes or city sights.
 *       This is because Wikipedia articles may not always feature photographs of cities, but instead focus on symbols,
 *       historical images, or maps. As a result, the image may not always align with the expected representation of a city
 *       that is visually appealing to users.
 *       While the Google Places API or Google Street View API would offer more appropriate cityscapes and landmarks,
 *       these are paid services and not considered realistic options for this project.
 */
export const getWikiArticleImageFromTitle = async (wikiArticleTitle) => {
  try {
    const queryRes = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        prop: 'pageimages',
        titles: wikiArticleTitle,
        pithumbsize: 1000, // Maximum image width (height scales automatically)
        origin: '*',
      },
    });

    const pageId = Object.keys(queryRes.data.query.pages)[0]; // pageId is dynamic
    const imageURL =
      queryRes.data.query.pages[pageId]?.thumbnail?.source || null;

    if (!imageURL) {
      throw new Error('No image in the article');
    }

    return imageURL;
  } catch (error) {
    throw new Error(
      `Failed to fetch image URL for article ${wikiArticleTitle}: ${error.message}`
    );
  }
};
