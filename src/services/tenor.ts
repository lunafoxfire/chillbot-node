import axios from 'axios';

const BASE_URL = 'https://api.tenor.com/v1';

export async function getRandomImageURL(query: string): Promise<string> {
  const response = await axios.request({
    method: 'GET',
    url: `${BASE_URL}/random`,
    params: {
      key: process.env.TENOR_API_KEY,
      locale: 'en_US',
      contentfilter: 'medium',
      media_filter: 'minimal',
      limit: '1',
      q: query || 'random',
    },
  });

  return response.data.results?.[0]?.url;
}
