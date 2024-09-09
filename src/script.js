import PhotosApi from './PhotosApi.js';
import LoadMoreBtn from './LoadMoreBtn.js';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const input = document.getElementsByTagName('input')[0];
const gallery = document.querySelector('.gallery');
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

const photosApi = new PhotosApi(); 

form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchPhotos);

async function onSubmit(e) {
  e.preventDefault();
  photosApi.searchQuery = input.value.trim(); 

  if (!photosApi.searchQuery) {
    Notiflix.Notify.warning('Please enter a search query.');
    return;
  }

  clearPhotosList();
  photosApi.resetPage();
  loadMoreBtn.hide();
  fetchPhotos();
}

async function fetchPhotos() {
  loadMoreBtn.disable();

  try {
    const { hits, totalHits } = await photosApi.getPhotos();

    if (hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.hide();
      return;
    }

    const markup = hits.map(createMarkup).join('');
    updatePhotosList(markup);

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    
    if (photosApi.queryPage * 40 >= totalHits) {
      loadMoreBtn.hide();
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.show();
    }

    loadMoreBtn.enable();
    
  } catch (error) {
    onError(error);
  }
}

function createMarkup({ webformatURL, tags, likes, views, comments, downloads }) {
  return `<div class="photo-card">
   <img src="${webformatURL}" alt="${tags}" loading="lazy" />
   <div class="info">
     <p class="info-item">
       <b>Likes</b> <br/> ${likes}
     </p>
     <p class="info-item">
       <b>Views</b> <br/> ${views}
     </p>
     <p class="info-item">
       <b>Comments</b> <br/> ${comments}
     </p>
     <p class="info-item">
       <b>Downloads</b> <br/> ${downloads}
     </p>
   </div>
 </div>`;
}

function clearPhotosList() {
  gallery.innerHTML = '';
}

function updatePhotosList(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
}

function onError(err) {
  Notiflix.Notify.failure('Something went wrong. Please try again.');
  console.error(err);
}
