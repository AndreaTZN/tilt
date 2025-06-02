/* eslint-disable @typescript-eslint/no-unused-vars */
import gsap from 'gsap';

import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

window.Webflow ||= [];
window.Webflow.push(() => {
  // ================================================
  // SLIDERS RESSOURCES
  // ================================================

  $('.slider_section').each(function () {
    const swiper = new Swiper('.swiper.is-ressources-slider', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      freeMode: true,

      a11y: {
        slideRole: 'listitem',
      },
      mousewheel: {
        forceToAxis: true,
      },
      scrollbar: {
        el: '.tab-scrollbar',
        draggable: true,
        dragClass: 'tab-scrollbar_drag',
        snapOnRelease: true,
        dragSize: '430',
      },
    });
  });

  $('.testimonials_component').each(function () {
    const swiper = new Swiper('.swiper.is-slider-testimonials', {
      slidesPerView: 'auto',
      effect: 'fade',
      pagination: {
        el: '.swiper-pagination.is-slider-testimonials',
        type: 'bullets',
        bulletClass: 'swiper-bullet',
        bulletActiveClass: 'is-active',
        bulletElement: 'button',
        clickable: true,
      },
      a11y: {
        slideRole: 'listitem',
      },
      mousewheel: {
        forceToAxis: true,
      },
      on: {
        init: function () {
          $('.swiper-bullet').each(function () {
            $(this).append('<div class="bullet-indicator"></div>');
          });
        },
      },
    });

    const swiperTestiCards = new Swiper('.swiper.is-testimonials-card', {
      slidesPerView: 'auto',
      effect: 'fade',
      a11y: {
        slideRole: 'listitem',
      },
    });

    swiper.controller.control = swiperTestiCards;
    swiperTestiCards.controller.control = swiper;
  });
  // ================================================
  // SLIDERS ABOUT
  // ================================================

  $('.valeurs_component').each(function () {
    const $wrapper = $(this).find('.valeurs_img-wrap');
    let currentRotation = 0;
    const swiper = new Swiper('.swiper.is-slider-valeurs', {
      slidesPerView: 1,
      spaceBetween: 10,
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      loopAdditionalSlides: 3,
      speed: 800,
      breakpoints: {
        992: {
          slidesPerView: 3,
          spaceBetween: 133,
          loopAdditionalSlides: 1,
        },
      },
      mousewheel: {
        enabled: true,
        forceToAxis: true,
      },
      on: {
        slideNextTransitionStart: function () {
          currentRotation += 30;
          gsap.to($wrapper, {
            rotate: currentRotation,
            duration: 1,
            ease: 'back.out(1)',
          });
        },
        slidePrevTransitionStart: function () {
          currentRotation -= 30;
          gsap.to($wrapper, {
            rotate: currentRotation,
            duration: 1,
            ease: 'back.out(1)',
          });
        },
      },
    });
  });
});
