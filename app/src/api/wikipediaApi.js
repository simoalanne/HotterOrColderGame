import axios from 'axios';

/**
 * Fetches an array of Wikipedia image URLs near the specified coordinates.
 * @param {number} lat - The latitude of the location.
 * @param {number} lon - The longitude of the location.
 * @returns {Promise<string[]>} A promise that resolves to an array of image URLs.
 */
export const getWikiImagesNearCoords = async (lat, lon) => {
  try {
    const res = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        generator: 'geosearch',
        ggscoord: `${lat}|${lon}`,
        ggsradius: 10000,
        ggslimit: 10,
        prop: 'pageimages',
        pithumbsize: 1000,
        origin: '*',
      },
    });

    const pages = res.data.query?.pages || {};
    const imageURLs = Object.values(pages)
      .map(page => page.thumbnail?.source)
      .filter(Boolean);

    return imageURLs;
  } catch (error) {
    throw new Error(`Failed to fetch Wikipedia images: ${error.message}`);
  }
};
