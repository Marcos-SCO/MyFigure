// core version + navigation, pagination modules:
import Swiper, { Navigation, Pagination, Autoplay, EffectFade, Keyboard } from 'swiper';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// configure Swiper to use modules
Swiper.use([Navigation, Pagination, Autoplay, EffectFade, Keyboard]);

// init Swiper:
const swiper = new Swiper('.swiper', {
  // Optional parameters
  effect: "fade",
  direction: 'horizontal',
  loop: true,
  spaceBetween: 0,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  scrollbar: {
    el: '.swiper-scrollbar',
  },
  // autoplay: {
  //   // delay: 5000,
  // },
  keyboard: {
    enabled: true,
    onlyInViewport: false,
  },
});