import axios from 'axios';

interface WikiThumbnail {
  source: string;
}

interface WikiPage {
  thumbnail?: WikiThumbnail;
}

interface WikiQueryResponse {
  batchcomplete?: string;
  query?: {
    pages: {
      [key: string]: WikiPage;
    };
  };
}

/**
 * Fetches an array of Wikipedia image URLs near the specified coordinates.
 * @param {number} lat - The latitude of the location.
 * @param {number} lon - The longitude of the location.
 * @returns {Promise<string[]>} A promise that resolves to an array of image URLs.
 */
export const getWikiImagesNearCoords = async (lat: number, lon: number): Promise<string[]> => {
  const res = await axios.get<WikiQueryResponse>('https://en.wikipedia.org/w/api.php', {
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
    headers: {
      'User-Agent': 'HotterOrColderGame/1.0'
    },
  });

  const pages = res.data.query?.pages ?? {};
  const imageURLs = Object.values(pages)
    .map((page: WikiPage) => page.thumbnail?.source)
    .filter((url): url is string => Boolean(url));

  return imageURLs;
};
