import { Notify } from 'notiflix';
import axios from 'axios';



const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery')
const btnLoadMore = document.querySelector('.load-more')
// console.log(searchForm);
const API = '33620588-dd89b1b0713208c28d32b322f';
axios.defaults.baseURL = 'https://pixabay.com/api'

let searchQuery = '';
let pageToFetch = 1;

// ==========================================================================================
async function fetchPictures(keyword, page) {
    try {
        const { data } = await axios("/", {
            params: {
                key: API,
                q: keyword,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                per_page: 40,
                page: pageToFetch
            },
        });
        return data;
        
    } catch (error) {
        console.log(error);
    }
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function getPictures(query) {
    const data = await fetchPictures(query);
    // if (data === undefined) {
    //     return Notify.failure("We're sorry, but you've reached the end of search results.")
    // }
    if (data.hits.length === 0) {
        return Notify.failure("We're sorry, but you've reached the end of search results.")
    }

    if (data.total === 0) {
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
    const photoCards = data.hits
    // console.log(photoCards);

    renderPictures(photoCards)
    pageToFetch += 1;
    if (data.total > 1 && pageToFetch !== data.total) {
        btnLoadMore.classList.remove('invisible-js');
        
    }
  
    // observer.observe(guard);
}

// ==============================================================
function handleSubmit(e) {
    e.preventDefault()
    const inputValue = e.target.elements.searchQuery.value.trim();
    if (!inputValue || inputValue === searchQuery) {
        return
    }
    
    searchQuery = inputValue;

    pageToFetch = 1;
    gallery.innerHTML = "";
    btnLoadMore.classList.add('invisible-js')
    getPictures(searchQuery, pageToFetch);
    searchForm.reset();

}

btnLoadMore.addEventListener('click', () => {
    btnLoadMore.classList.add('invisible-js')
    getPictures(searchQuery, pageToFetch)
})

searchForm.addEventListener('submit', handleSubmit);

// ===================================================================================================

function renderPictures(photoCards) {
    const markup = photoCards.map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
            <div class="photo-card">
  <img src=${webformatURL} alt=${tags} loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
      
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
        })
        .join('')
    gallery.insertAdjacentHTML('beforeend', markup)
}

// webformatURL - ссылка на маленькое изображение для списка карточек.
//     largeImageURL - ссылка на большое изображение.
//         tags - строка с описанием изображения.Подойдет для атрибута alt.
//             likes - количество лайков.
//                 views - количество просмотров.
//                     comments - количество комментариев.
//                         downloads - количество загрузок.