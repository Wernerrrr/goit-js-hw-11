import axios from 'axios';

const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '45879841-3ac79e2e35419c40c3abe6716';

export default class PhotosApi {
  constructor() {
    this.queryPage = 1;
    this.searchQuery = '';
  }

  async getPhotos() {
    const url = `${ENDPOINT}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.queryPage}`;

    const response = await axios.get(url);
    this.increasePage(); 
    return response.data; 
  }

  resetPage() {
    this.queryPage = 1;
  }

  increasePage() {
    this.queryPage += 1;
  }
}


