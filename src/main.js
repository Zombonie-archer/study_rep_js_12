import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import getImagesByQuery from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const loadMoreButton = document.querySelector('.load-more');
let page = 1;
let currentQuery = '';

form.addEventListener('submit', async event => {
  loadMoreButton.classList.add('hidden');
  page = 1;
  event.preventDefault();
  currentQuery = event.target.elements['search-text'].value.trim();
  if (!currentQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }
  clearGallery();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, page);
    if (!data.hits || data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }
    createGallery(data.hits);
    if (data.totalHits > page * 15) {
      loadMoreButton.classList.remove('hidden');
    } else {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message:
        'An error occurred while fetching images. Please try again later.',
      position: 'topRight',
    });
  }
  hideLoader();
  event.target.reset();
});

loadMoreButton.addEventListener('click', async () => {
  page++;
  loadMoreButton.classList.add('hidden');
  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, page);
    if (!data.hits || data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }
    createGallery(data.hits);
    const cardHeight = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    if (data.totalHits > page * 15) {
      loadMoreButton.classList.remove('hidden');
    } else {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message:
        'An error occurred while fetching images. Please try again later.',
      position: 'topRight',
    });
  }
  hideLoader();
});
