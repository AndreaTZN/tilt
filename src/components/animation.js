/* eslint-disable @typescript-eslint/no-unused-vars */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import SplitType from 'split-type';
import { Reeller } from 'reeller';
import { Flip } from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
Reeller.registerGSAP(gsap);
gsap.registerPlugin(ScrollTrigger, Flip, DrawSVGPlugin, MotionPathPlugin);

window.Webflow ||= [];
window.Webflow.push(() => {
  const mm = gsap.matchMedia();
  // ================================================
  // NAVBAR DROPDOWNS
  // ================================================
  $('.nav_component').each(function () {
    if (window.innerWidth > 992) {
      let timelines = {};
      let isDropdownOpen = {};
      let isDropdownAnimated = {};
      function initializeDropdown(selector, timelineKey) {
        const dropdownLink = document.querySelector(`.navbar_menu-dropdown.${selector}`);
        const dropdownArrow = document.querySelector(`.dropdown-chevron.${selector}`);
        const dropdownContainer = document.querySelector(`.dropdown-container.${selector}`);
        const dropdownWrapper = document.querySelector(`.dropdown-wrapper.${selector}`);
        const dropdownLine = document.querySelector(`[nav-dropdown-line = "${selector}"]`);
        const blurDropdown = document.querySelector(`[nav-dropdown-blur = "${selector}`);
        if (!dropdownLink || !dropdownContainer || !dropdownWrapper) return;
        timelines[timelineKey] = gsap
          .timeline({ paused: true, reversed: true })
          .to(dropdownContainer, { display: 'flex', duration: 0 })
          .fromTo(
            dropdownWrapper,
            { opacity: 0, y: '-1rem' },
            {
              opacity: 1,
              y: '0rem',
              duration: 0.5,
              ease: 'power2.out',
            }
          )
          .to(dropdownArrow, { rotate: 180, duration: 1, ease: 'power2.out' }, '<')
          .to(blurDropdown, { opacity: 1, duration: 0.6 }, '<')
          .to(dropdownLine, { scaleX: 1, duration: 0.6 }, '-=.3');
        isDropdownOpen[timelineKey] = false;
        function openDropdown() {
          timelines[timelineKey].play();
          dropdownContainer.style.zIndex = '3';
          isDropdownOpen[timelineKey] = true;
        }
        function closeDropdown() {
          timelines[timelineKey].timeScale(7).reverse();
          dropdownContainer.style.zIndex = '1';
          isDropdownOpen[timelineKey] = false;
        }
        function handleMouseLeave(event) {
          if (
            !dropdownLink.contains(event.relatedTarget) &&
            !dropdownContainer.contains(event.relatedTarget)
          ) {
            closeDropdown();
          }
        }
        dropdownLink.addEventListener('mouseenter', () => {
          if (!isDropdownOpen[timelineKey]) {
            timelines[timelineKey].timeScale(1);
            openDropdown();
          }
        });
        dropdownLink.addEventListener('mouseleave', handleMouseLeave);
        dropdownContainer.addEventListener('mouseleave', handleMouseLeave);
      }
      function destroyDropdown(selector, timelineKey) {
        const dropdownLink = document.querySelector(`.navbar_menu-dropdown.${selector}`);
        const dropdownContainer = document.querySelector(`.dropdown-container.${selector}`);
        if (dropdownLink && dropdownContainer) {
          dropdownLink.replaceWith(dropdownLink.cloneNode(true)); // Remove all listeners
          dropdownContainer.replaceWith(dropdownContainer.cloneNode(true));
        }
        if (timelines[timelineKey]) {
          timelines[timelineKey].kill();
          delete timelines[timelineKey];
          delete isDropdownOpen[timelineKey];
        }
      }
      // Initialisation dynamique en fonction de la taille de l'écran
      function handleResize() {
        const selectors = [
          { key: 'product', className: 'is-solutions' },
          { key: 'clients', className: 'is-clients' },
        ];
        if (window.innerWidth > 992) {
          selectors.forEach(({ key, className }) => {
            if (!timelines[key]) {
              initializeDropdown(className, key);
            }
          });
        } else {
          selectors.forEach(({ key, className }) => {
            destroyDropdown(className, key);
          });
        }
      }
      window.addEventListener('resize', handleResize);
      handleResize();
    }
    if (window.innerWidth < 992) {
      let navbarDropdownToggle = document.querySelectorAll('.navbar_dropdwn-toggle');
      let buttonMenuMobile = document.querySelector('.nav_burger');
      navbarDropdownToggle.forEach((toggleButton) => {
        let dropdownIsOpen = false;
        toggleButton.addEventListener('click', () => {
          dropdownIsOpen = true;
        });
        buttonMenuMobile.addEventListener('click', () => {
          if (dropdownIsOpen) {
            toggleButton.click();
            dropdownIsOpen = false;
          }
        });
      });
    }

    const navBurger = document.querySelector('.nav_burger');
    let isMenuOpen = false;

    navBurger.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;

      if (isMenuOpen) {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        document.body.style.top = '0';
        document.body.style.left = '0';
      } else {
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.top = '';
        document.body.style.left = '';
      }
    });
  });

  // ================================================
  // HOME
  // ================================================

  $('.home-text_section').each(function (index) {
    const el = $(this);
    const cube1 = el.find('.home-text_cube.is-1');
    const cube2 = el.find('.home-text_cube.is-2');
    const cube3 = el.find('.home-text_cube.is-3');

    mm.add(
      {
        // mobile/tablette ≤ 991px
        isTablet: '(max-width: 991px)',
        // desktop > 991px
        isDesktop: '(min-width: 992px)',
      },
      (context) => {
        let pathId;

        if (context.conditions.isTablet) {
          pathId = '#motionPathMobile'; // <= ajoute ce path dans ton HTML avec cet id
        }

        if (context.conditions.isDesktop) {
          pathId = '#motionPathDesktop'; // <= idem pour desktop
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: '30% center',
            end: '90% center',
            scrub: 1,
            once: 1,
          },
        });
        tl.set([cube1, cube2, cube3], {
          opacity: 1,
        });
        tl.to(
          cube1,
          {
            duration: 1,
            ease: 'power2.out',
            scale: 0.7,
            rotate: '80deg',
            motionPath: {
              path: pathId,
              align: pathId,
              autoRotate: false,
              alignOrigin: [0.5, 0.5],
            },
          },
          0
        )
          .to(
            cube2,
            {
              duration: 1,
              ease: 'power2.out',
              scale: 0.7,
              rotate: '-80deg',
              motionPath: {
                path: pathId,
                align: pathId,
                autoRotate: false,
                alignOrigin: [0.5, 0.5],
              },
            },
            0.1
          )
          .to(
            cube3,
            {
              duration: 1,
              ease: 'power2.out',
              scale: 0.5,
              rotate: '-80deg',
              motionPath: {
                path: pathId,
                align: pathId,
                autoRotate: false,
                alignOrigin: [0.5, 0.5],
              },
            },
            0.2
          )
          .to(
            [cube1, cube2, cube3],
            {
              opacity: 0,
              duration: 0.3,
              ease: 'power1.out',
            },
            0.8
          );
      }
    );
  });
  $('.home-text2_component').each(function () {
    console.log('test');
    let homeImgCubePyramide = $(this).find('.home-text2_image-cube');
    let mm = gsap.matchMedia();
    mm.add('(min-width: 992px)', () => {
      gsap.to(homeImgCubePyramide, {
        scrollTrigger: {
          trigger: $(this),
          start: 'top 80%',
          end: 'bottom 50%',
          once: true,
        },
        y: '1%',
        duration: 1,
        ease: 'power1.out',
      });
    });
    mm.add('(max-width: 992px)', () => {
      gsap.to(homeImgCubePyramide, {
        scrollTrigger: {
          trigger: '.home-text2_image-wrap',
          start: 'top 90%',
          end: 'bottom 50%',
          once: true,
        },
        bottom: '0rem',
        duration: 1,
        ease: 'power1.out',
      });
    });
  });
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

  $('.layout2_card-reel-wrap').each(function () {
    const $wrap = $(this); // .layout2_card-reel-wrap (le wrapper global)

    const $container = $wrap.find('.layout2_reel')[0];

    let reeller = new Reeller({
      container: $container,
      wrapper: '.layout2_reel-wrap',
      itemSelector: '.layout2_reel-item',
      speed: 20,
    });
  });
  $('.layout2_card-reel-wrap').each(function () {
    const $wrap = $(this); // .layout2_card-reel-wrap (le wrapper global)

    const $container = $wrap.find('.layout2_reel')[1];

    let reeller = new Reeller({
      container: $container,
      wrapper: '.layout2_reel-wrap',
      itemSelector: '.layout2_reel-item',
      speed: 20,
    });
    reeller.reverse(true);
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
              duration: 1,
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
  // INVESTISSEURS
  // ================================================

  let typeSplitScrubWord = new SplitType('[text-split]', {
    types: 'words, chars',
    tagName: 'span',
  });
  gsap.set('[text-split]', { opacity: 1 });

  $('[scrub-each-word]').each(function (index) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: 'top 50%',
        end: 'bottom 50%',
        once: true,
        scrub: 0.5,
      },
    });
    tl.fromTo(
      $(this).find('.word'),
      { color: '#D9D9DA' },
      {
        color: '#515050',
        duration: 1.2,
        ease: 'power1.out',
        stagger: { each: 0.4 },
      }
    );
  });

  $('.investisseurs_component').each(function () {
    let $this = $(this);
    let investisseursLogos = $this.find('.investisseurs_logo-wrap');
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.investisseurs_logo-contain',
        start: 'top 70%',
        end: 'bottom 50%',
        markers: false,
        once: true,
      },
    });
    tl.to(investisseursLogos, {
      opacity: 1,
      duration: 1.5,
      ease: 'power1.out',
      stagger: { each: 0.2 },
    });
  });

  // ================================================
  // CTA 2
  // ================================================

  $('.cta2_section').each(function () {
    let el = $(this);
    let cube = el.find('.cta2_cube');
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',

        scrub: true,
      },
    });

    tl.to(cube, {
      yPercent: 120,
      willChange: 'tranform',
      ease: 'none',
    });
  });

  // ================================================
  // CLIENTS
  // ================================================
  $('[client-consommateurs]').each(function () {
    let $this = $(this);
    let $icons = $this.find('.client-hero_toggle-icon-1');
    let $icons2contour = $this.find('.client-hero_toggle-icon-2-contour');
    let $icons2 = $this.find('.client-hero_toggle-icon-2');
    let clientHeroToggleDotWrap = $this.find('.client-hero_toggle-dot-wrap');
    let clientHeroToggleDot = $this.find('.client-hero_toggle-dot');
    let clientHeroGraphWrap = $this.find('.client-hero_graph-wrap');
    let delayBetweenStates = 4000;
    let tl = gsap.timeline({ paused: true });
    tl.to(clientHeroToggleDotWrap, {
      x: '-100%',
      duration: 0.5,
    }).to(
      clientHeroToggleDot,
      {
        backgroundColor: '#E30E6E',
        duration: 0.5,
      },
      '<'
    );
    setTimeout(() => {
      tl.play();
      setTimeout(() => {
        tl.reverse();
      }, tl.duration() * 1000 + delayBetweenStates);
    }, 1000);
    let tlIcones = gsap.timeline();
    tlIcones
      .to($icons, {
        rotate: 180,
        duration: 0.5,
        delay: 1,
      })
      .to(
        $icons,
        {
          opacity: 0,
          duration: 0.5,
        },
        '+=3'
      )
      .to(
        $icons2,
        {
          opacity: 1,
          duration: 0.5,
        },
        '<'
      )
      .to(
        $icons2contour,
        {
          opacity: 1,
          duration: 0.5,
        },
        '<'
      )
      .to(
        $icons2,
        {
          rotate: 180,
          y: 1.2,
          duration: 0.5,
        },
        '+=.5'
      );
    gsap.to(clientHeroGraphWrap, {
      opacity: 1,
      duration: 0.5,
      ease: 'power1.out',
      delay: 0.5,
    });
  });
  $('[connecte-consommateurs]').each(function () {
    let $this = $(this);
    let connecteRightCube = $this.find('.connecte_right-cube');
    let connecteLeftCube = $this.find('.connecte_left-cube');
    let tlCubeGauche = gsap.timeline({ paused: true, once: true });
    function floatAxis(el, prop, min, max, minDur, maxDur) {
      function animate() {
        gsap.to(el, {
          [prop]: gsap.utils.random(min, max),
          duration: gsap.utils.random(minDur, maxDur),
          ease: 'sine.inOut',
          onComplete: animate,
        });
      }
      animate();
    }
    floatAxis(connecteRightCube, 'x', -8, 8, 2, 3);
    floatAxis(connecteRightCube, 'y', -8, 8, 2, 3);
    floatAxis(connecteRightCube, 'rotate', -4, 4, 2, 3);
    tlCubeGauche.to(connecteLeftCube, {
      y: '0%',
      x: '0%',
      duration: 1,
      ease: 'linear',
    });
    ScrollTrigger.create({
      trigger: $this,
      start: 'top 70%',
      end: 'bottom 50%',
      onEnter: () => {
        tlCubeGauche.play();
      },
    });
  });
  $('.connecte2_contain').each(function () {
    let $this = $(this);
    let connecte2Cards = $this.find('.connecte2_card');
    connecte2Cards.each(function () {
      let $this = $(this);
      let tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: $this,
          start: 'top 60%',
          end: 'bottom 50%',
        },
      });
      tl.to($this, {
        opacity: 1,
        transform: 'translateY(0)',
      });
    });
  });

  // ================================================
  // FAQ
  // ================================================
  $('.faq_component').each(function () {
    let faqTimelines = [];
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
      faqTimelines.push({ tl, isPlaying: false });
      if (index === 0) {
        tl.play();
        faqTimelines[index].isPlaying = true;
      }
      $(this).on('click', () => {
        faqTimelines.forEach((item, i) => {
          if (i !== index && item.isPlaying) {
            item.tl.reverse();
            item.isPlaying = false;
          }
        });
        if (faqTimelines[index].isPlaying) {
          faqTimelines[index].tl.reverse();
          faqTimelines[index].isPlaying = false;
        } else {
          faqTimelines[index].tl.play();
          faqTimelines[index].isPlaying = true;
        }
      });
    });
    // Initialiser un tableau vide pour stocker les données de la FAQ
    let faqArray = [];
    // Trouver tous les éléments de la classe faq_title à l'intérieur du faq_wrapper actuel
    let faqTitle = $(this).find('.faq_title');
    // Trouver tous les éléments de la classe rich_text_faq à l'intérieur du faq_wrapper actuel
    let faqAnswer = $(this).find('.faq-rich-text');
    // Parcourir chaque élément de la classe faq_title
    faqTitle.each(function (index, element) {
      // Obtenir le contenu texte de l'élément faq_title actuel
      let question = $(element).text();
      // Obtenir le contenu HTML de l'élément rich_text_faq correspondant
      let answer = $(faqAnswer[index]).html();
      // Créer un nouvel objet FAQ avec les données de la question et de la réponse
      let faqObject = {
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      };
      // Ajouter l'objet FAQ au tableau faqArray
      faqArray.push(faqObject);
    });
    // Créer un nouvel objet FAQPage avec les données du tableau faqArray
    let faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqArray,
    };
    // Créer un nouvel élément script pour stocker les données JSON-LD
    let script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(faqSchema);
    // Ajouter l'élément script à l'en-tête du document
    document.getElementsByTagName('head')[0].appendChild(script);
  });

  // ================================================
  // LAYOUT CLIENTS REEL
  // ================================================
  $('.layout2-client_reel-component').each(function () {
    let reeller = new Reeller({
      container: '.layout2-client_reel',
      wrapper: '.layout2-client_reel-wrap',
      itemSelector: '.layout2-client_reel-item',
      speed: 10,
    });

    reeller.reverse(true);
  });
});
