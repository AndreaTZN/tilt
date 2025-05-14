/* eslint-disable @typescript-eslint/no-unused-vars */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';

import { Reeller } from 'reeller';
import { Flip } from 'gsap/Flip';

Reeller.registerGSAP(gsap);
gsap.registerPlugin(ScrollTrigger, Flip, DrawSVGPlugin);

window.Webflow ||= [];
window.Webflow.push(() => {
  // ================================================
  // HOME
  // ================================================

  $('.home-text_section').each(function () {});

  //REELLER
  $('.partners_component').each(function () {
    let reeller = new Reeller({
      container: '.partners_reel',
      wrapper: '.partners_reel_wrap',
      itemSelector: '.partners_reel_item',
      speed: 10,
    });

    reeller.reverse(true);
  });

  $('.layout_reel-wrapper').each(function () {
    let reeller = new Reeller({
      container: '.layout_reel',
      wrapper: '.layout_reel-wrap',
      itemSelector: '.layout_reel-item',
      speed: 20,
    });
  });

  // TAB ANIMATION

  $('.home-tabs_component').each(function () {
    const el = $(this);
    const itemsText = el.find('.features-tab_items');
    const itemText = itemsText.find('.features-tab_item');
    const illus = $('.features-tab_illu');
    const progressBar = $('.button_circle-progress');

    let currentIndex = 0;
    let autoChangeInterval = 10000;
    let interval;
    let progressAnimation;

    // Stocker les instances de SplitType pour chaque titre dupliqué
    let splitInstances = [];

    gsap.set(progressBar, { drawSVG: 0 });

    // Dupliquer les titres et les cacher par défaut, les placer juste après les éléments d'origine
    itemText.each(function (i) {
      const itemContent = $(this).find('.features-tab_item-content');
      const originalTitle = itemContent.find('.features-tab_title');

      if (i === 0) {
        itemContent.find('.features-tab_p-content').css({ height: 'auto', opacity: 1 });
      } else {
      }
    });

    const setActiveItem = (index) => {
      currentIndex = index;

      // Mettre à jour les éléments actifs
      itemText.removeClass('active').eq(index).addClass('active');
      illus.removeClass('active').eq(index).addClass('active');

      // Gérer l'affichage du titre dupliqué
      itemText.each(function (i) {
        const paragraphe = $(this).find('.features-tab_p-content');

        if (i === index) {
          // Assurez-vous que l'opacité est définie sur 1
          gsap.set([paragraphe], { opacity: 1 });

          let tl = gsap.timeline();
          tl.to(
            paragraphe,
            {
              height: 'auto',
              duration: 0.6,
              ease: 'power3.out',
            },
            '<'
          ).from(
            paragraphe,
            {
              yPercent: 10,
              opacity: 0,
              duration: 1,
              ease: 'power3.out',
            },
            '-=1'
          );

          // Désactiver le clic sur l'élément actif
          $(this).addClass('disabled').off('click');
        } else {
          $(this).removeClass('disabled').on('click', itemClickHandler); // Réactiver le clic sur les éléments inactifs
        }

        if (i !== index) {
          gsap.set(progressBar, { drawSVG: 0 });
          gsap.to(
            paragraphe,
            {
              height: 0,
              opacity: 0, // Assurez-vous de réinitialiser l'opacité à 0 pour les éléments inactifs
            },
            '<'
          );
        }
      });

      // Arrêter l'animation de la barre de progression précédente si elle existe
      if (progressAnimation) {
        progressAnimation.kill();
      }

      // Animation de la barre de progression de l'élément actif
      startProgressAnimation(index);
    };

    // Fonction pour démarrer l'animation de la barre de progression
    const startProgressAnimation = (index) => {
      const activeProgressBar = itemText.eq(index).find('.button_circle-progress');

      progressAnimation = gsap.fromTo(
        activeProgressBar,
        { drawSVG: 0 },
        { drawSVG: 100, duration: 13, ease: 'linear' }
      );
    };

    const startAutoChange = () => {
      interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % itemText.length;
        setActiveItem(currentIndex);
      }, autoChangeInterval);
    };

    const stopAutoChange = () => {
      clearInterval(interval);
      if (progressAnimation) {
        progressAnimation.kill();
      }
    };

    // Gestionnaire de clic pour les items
    const itemClickHandler = (event) => {
      const clickedIndex = $(event.currentTarget).index();
      if (clickedIndex !== currentIndex) {
        stopAutoChange();
        setActiveItem(clickedIndex);
        startAutoChange();
        gsap.set(progressBar, { drawSVG: 0 });
      }
    };

    // Attacher l'événement de clic
    itemText.on('click', itemClickHandler);

    // Utilisation de ScrollTrigger pour contrôler l'animation au scroll
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end: 'bottom top',

      onEnter: () => {
        startProgressAnimation(currentIndex);
        startAutoChange();
      },
      onLeave: stopAutoChange,
      onEnterBack: () => {
        startProgressAnimation(currentIndex);
        startAutoChange();
      },
      onLeaveBack: stopAutoChange,
    });
  });

  // CHIFFRES CLÉS
  $('.home-chiffres_component').each(function () {
    let el = $(this); // Corrigé : $('this') → $(this)
    let chiffresItems = el.find('.home-chiffres_item-wrap');

    chiffresItems.each(function () {
      let item = $(this);

      gsap.to(item, {
        scrollTrigger: {
          trigger: item[0],
          start: 'top 70%',
          toggleClass: {
            targets: item,
            className: 'is-active',
          },
          once: false,
        },
      });
    });
  });

  $('.home-flexi_section').each(function () {
    let el = $(this);
    let illu = el.find('.home-flexi_illu');

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
    tl.to(illu, {
      rotateZ: '-10deg',
      ease: 'none',
      duration: 1.2,
    });
  });
  // ================================================
  // CONTACT
  // ================================================

  $('.contact-cta_component').each(function () {
    let reel = $(this);
    const reeller = new Reeller({
      container: '.contact-cta_container.is-1',
      wrapper: '.contact-cta_wrap.is-1',
      itemSelector: '.contact_cta-text.is-1',
      speed: 10,
      autoUpdate: false,
    });
    reeller.reverse(true);
    const reeller2 = new Reeller({
      container: '.contact-cta_container.is-2',
      wrapper: '.contact-cta_wrap.is-2',
      itemSelector: '.contact_cta-text.is-2',
      speed: 10,
      autoUpdate: false,
    });
    let reelerContain1 = reel.find('.contact-cta_container.is-1');
    let reelerContain2 = reel.find('.contact-cta_container.is-2');
    let tl = gsap.timeline({ paused: true });
    tl.to(reelerContain1, {
      y: '-100%',
      duration: 0.5,
    }).to(
      reelerContain2,
      {
        y: '0%',
        duration: 0.5,
      },
      '<'
    );
    ScrollTrigger.create({
      trigger: reel,
      start: 'top 50%',
      end: 'bottom top',

      onEnter: () => {
        tl.play();
      },
      onLeaveBack: () => {
        tl.reverse();
      },
    });
  });

  // ================================================
  // ABOUT
  // ================================================

  $('.all-jobs_component').each(function () {
    let $this = $(this);
    let jobCubeItems = $this.find('.all-jobs_cube-item');
    let cubeOnAnimation = 0;
    function animateNextCube() {
      let current = jobCubeItems.eq(cubeOnAnimation);
      let nextIndex = (cubeOnAnimation + 1) % jobCubeItems.length;
      let next = jobCubeItems.eq(nextIndex);
      let currentInside = current.find('.all-jobs_cube-item-inside');
      let currentBorder = current.find('.all-jobs_cube-item-border');
      let nextInside = next.find('.all-jobs_cube-item-inside');
      let nextBorder = next.find('.all-jobs_cube-item-border');
      let tl = gsap.timeline({
        onComplete: () => {
          cubeOnAnimation = nextIndex;
          setTimeout(animateNextCube, 1000);
        },
      });
      tl.to(
        currentInside,
        {
          scale: 0,
          duration: 1,
          ease: 'power2.inOut',
        },
        0
      )
        .to(
          currentBorder,
          {
            opacity: 0.2,
            duration: 1,
            ease: 'power2.inOut',
          },
          0
        )
        .fromTo(
          nextInside,
          {
            scale: 0,
          },
          {
            scale: 1,
            duration: 1,
            ease: 'power2.inOut',
          },
          0
        )
        .fromTo(
          nextBorder,
          {
            opacity: 0.2,
          },
          {
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut',
          },
          0
        );
    }
    animateNextCube();
    let allJobsListWraps = $this.find('.all-jobs-list_wrap');
    allJobsListWraps.each(function () {
      let $this = $(this);
      let mm = gsap.matchMedia();
      // Desktop only
      mm.add('(min-width: 993px)', () => {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: $this,
            start: 'top 90%',
            end: 'bottom 90%',
            scrub: 1,
            markers: false,
          },
        });
        tl.to($this, {
          opacity: 0.5,
          transform: 'translateY(0)',
          duration: 0.5,
          ease: 'power2.inOut',
        });
        $this.on('mouseenter', () => {
          gsap.to($this, {
            opacity: 1,
          });
        });
        $this.on('mouseleave', () => {
          gsap.to($this, {
            opacity: 0.5,
          });
        });
      });
      // Mobile only
      mm.add('(max-width: 992px)', () => {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: $this,
            start: 'top 90%',
            end: 'bottom 90%',
            scrub: 1,
            markers: false,
          },
        });
        tl.to($this, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
    });
  });

  // ================================================
  // FAQ
  // ================================================

  $('.faq_item').each(function (index) {
    let answer = $(this).find('.faq_answer');
    let line1 = $(this).find('.faq-header_icon.is-1');
    let line2 = $(this).find('.faq-header_icon.is-2');
    let title = $(this).find('.faq_title');
    const tl = gsap.timeline({ paused: true });
    tl.to(
      answer,
      {
        height: 'auto',
        duration: 0.6,
        ease: 'power2.inOut',
      },
      'start'
    )
      .to(
        title,
        {
          opacity: 1,
        },
        'start'
      )
      .to(
        line1,
        {
          rotate: -45,
          duration: 0.6,
          backgroundColor: '#155CED',
          opacity: 1,
          ease: 'power2.inOut',
        },
        'start'
      )
      .to(
        line2,
        {
          rotate: 45,
          duration: 0.6,
          backgroundColor: '#155CED',
          opacity: 1,
          ease: 'power2.inOut',
        },
        'start'
      );
    let isPlaying = false;
    // Si c'est le premier item, jouer automatiquement l'animation
    if (index === 0) {
      tl.play();
      isPlaying = true;
    }
    $(this).on('click', () => {
      if (isPlaying) {
        tl.reverse();
        isPlaying = false;
      } else {
        tl.play();
        isPlaying = true;
      }
    });
  });
});
