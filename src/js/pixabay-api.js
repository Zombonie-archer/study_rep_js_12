import axios from 'axios';

const API_KEY = '56799357-5764c9f004e69503c7bfa7d57';
const BASE_URL = 'https://pixabay.com/api/';

export default async function getImagesByQuery(query, page = 1) {
  const { data } = await axios
    .get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        page,
        per_page: 15,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    return data;
}
