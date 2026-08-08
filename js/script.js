(function () {
  'use strict';

  var body = document.body;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Mobile menu ---------------- */
  var menuBtn = document.querySelector('.hamburger-btn');
  var menu = document.querySelector('.mobile-menu');
  var overlay = document.querySelector('.mobile-overlay');

  function setMenuState(opening) {
    if (!menu) return;
    menuBtn && menuBtn.classList.toggle('active', opening);
    menu.classList.toggle('active', opening);
    overlay && overlay.classList.toggle('active', opening);
    body.classList.toggle('overflow-hidden', opening);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', opening ? 'true' : 'false');
    if (menuBtn) {
      menuBtn.innerHTML = opening
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    }
  }

  function closeMenu() {
    setMenuState(false);
  }

  function toggleMenu() {
    setMenuState(!menu.classList.contains('active'));
  }

  if (menuBtn && menu && overlay) {
    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
  }

  document.querySelectorAll('.menu-close').forEach(function (el) {
    el.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('active')) {
      closeMenu();
      if (menuBtn) menuBtn.focus();
    }
  });

  document.querySelectorAll('.menu-parent').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      this.closest('.menu-item-has-children').classList.toggle('open');
    });
  });

  document.querySelectorAll('.sub-menu a').forEach(function (el) {
    el.addEventListener('click', closeMenu);
  });

  /* ---------------- Navbar scroll effect ---------------- */
  var nav = document.querySelector('nav');
  if (nav) {
    var onNavScroll = function () {
      nav.classList.toggle('shadow-soft', window.scrollY > 10);
    };
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
  }

  /* ---------------- Scroll to top ---------------- */
  var topBtn = document.getElementById('topBtn');
  if (topBtn) {
    window.addEventListener(
      'scroll',
      function () {
        var show = body.scrollTop > 100 || document.documentElement.scrollTop > 100;
        topBtn.style.opacity = show ? '1' : '0';
        topBtn.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
      },
      { passive: true }
    );
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Smooth scroll for in-page anchors ---------------- */
  var navEl = document.querySelector('nav');
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = (navEl ? navEl.offsetHeight : 0) + 20;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      if (menu && menu.classList.contains('active')) closeMenu();
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (prefersReducedMotion) {
      revealEls.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------------- Hero slider ---------------- */
  var hero = document.querySelector('.hero-slides');
  var heroTimer;
  var heroSlides = [];
  var heroDots = [];
  var heroIndex = 0;

  function heroGo(i) {
    if (!heroSlides.length) return;
    heroIndex = (i + heroSlides.length) % heroSlides.length;
    heroSlides.forEach(function (s, j) {
      var active = j === heroIndex;
      s.classList.toggle('active', active);
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    heroDots.forEach(function (d, j) {
      d.classList.toggle('active', j === heroIndex);
      d.setAttribute('aria-selected', j === heroIndex ? 'true' : 'false');
    });
  }

  function heroNext() {
    heroGo(heroIndex + 1);
  }
  function heroPrev() {
    heroGo(heroIndex - 1);
  }
  function heroStart() {
    clearInterval(heroTimer);
    if (!prefersReducedMotion && heroSlides.length > 1) {
      heroTimer = setInterval(heroNext, 5000);
    }
  }
  function heroStop() {
    clearInterval(heroTimer);
  }

  function initHeroSlider() {
    if (!hero) return;
    heroStop();
    heroSlides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dotsWrap = hero.querySelector('.hero-dots');
    if (dotsWrap) dotsWrap.innerHTML = '';
    heroDots = [];
    if (dotsWrap) {
      heroSlides.forEach(function (s, i) {
        var d = document.createElement('button');
        d.className = 'slider-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.setAttribute('role', 'tab');
        d.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        d.addEventListener('click', function () {
          heroGo(i);
          heroStop();
          heroStart();
        });
        dotsWrap.appendChild(d);
        heroDots.push(d);
      });
    }
    heroIndex = 0;
    heroGo(0);
    heroStart();
  }

  if (hero) {
    hero.querySelectorAll('.hero-nav-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        if (parseInt(b.getAttribute('data-dir'), 10) < 0) heroPrev();
        else heroNext();
        heroStop();
        heroStart();
      });
    });
    hero.addEventListener('mouseenter', heroStop);
    hero.addEventListener('mouseleave', function () {
      if (!prefersReducedMotion) heroStart();
    });
    initHeroSlider();
  }

  /* ---------------- Testimonial slider ---------------- */
  var tItems = [];
  var tPrevBtn = document.getElementById('prev-testimonial');
  var tNextBtn = document.getElementById('next-testimonial');
  var tDotsWrap = document.getElementById('testimonial-dots');
  var tCurrent = 0;
  var tTimer;

  function showTestimonial(index) {
    if (!tItems.length) return;
    tCurrent = (index + tItems.length) % tItems.length;
    tItems.forEach(function (el, i) {
      el.classList.toggle('hidden', i !== tCurrent);
    });
    if (tDotsWrap) {
      tDotsWrap.querySelectorAll('.slider-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === tCurrent);
        d.setAttribute('aria-selected', i === tCurrent ? 'true' : 'false');
      });
    }
  }

  function tStart() {
    clearInterval(tTimer);
    if (!prefersReducedMotion && tItems.length > 1) {
      tTimer = setInterval(function () {
        showTestimonial(tCurrent + 1);
      }, 6000);
    }
  }
  function tStop() {
    clearInterval(tTimer);
  }

  function initTestimonials() {
    tStop();
    tItems = Array.prototype.slice.call(document.querySelectorAll('.testimonial-item'));
    tPrevBtn = document.getElementById('prev-testimonial');
    tNextBtn = document.getElementById('next-testimonial');
    tDotsWrap = document.getElementById('testimonial-dots');
    if (!tItems.length) return;
    if (tDotsWrap) tDotsWrap.innerHTML = '';
    if (tDotsWrap) {
      tItems.forEach(function (s, i) {
        var d = document.createElement('button');
        d.className = 'slider-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
        d.setAttribute('role', 'tab');
        d.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        d.addEventListener('click', function () {
          showTestimonial(i);
          tStop();
          tStart();
        });
        tDotsWrap.appendChild(d);
      });
    }
    tCurrent = 0;
    showTestimonial(0);
    tStart();
  }

  if (tPrevBtn && tNextBtn) {
    tPrevBtn.addEventListener('click', function () {
      showTestimonial(tCurrent - 1);
      tStop();
      tStart();
    });
    tNextBtn.addEventListener('click', function () {
      showTestimonial(tCurrent + 1);
      tStop();
      tStart();
    });
  }
  var tSlider = document.querySelector('.testimonial-slider');
  if (tSlider) {
    tSlider.addEventListener('mouseenter', tStop);
    tSlider.addEventListener('mouseleave', function () {
      if (!prefersReducedMotion) tStart();
    });
  }
  initTestimonials();

  /* ---------------- FAQ accordion ---------------- */
  function initFaq() {
    document.querySelectorAll('.faq').forEach(function (faq) {
      var question = faq.querySelector('.question');
      var answer = faq.querySelector('.answer');
      var icon = faq.querySelector('.fa-chevron-down');
      if (!answer || !question) return;
      if (question.getAttribute('data-faq-bound') === '1') return;
      question.setAttribute('data-faq-bound', '1');

      function setOpen(open) {
        answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
        if (icon) icon.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
        question.setAttribute('aria-expanded', open ? 'true' : 'false');
      }

      question.addEventListener('click', function () {
        var open = answer.style.maxHeight && answer.style.maxHeight !== '0px';
        setOpen(!open);
      });

      question.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }
  initFaq();

  /* ---------------- Contact widget (About page) ---------------- */
  var contactWidget = document.getElementById('contact-widget');
  var multiTab = document.getElementById('multi-tab');
  var widgetOpen = false;

  function toggleContactWidget() {
    if (!contactWidget || !multiTab) return;
    widgetOpen = !widgetOpen;
    if (widgetOpen) {
      contactWidget.style.display = 'block';
      setTimeout(function () {
        contactWidget.style.opacity = '1';
        contactWidget.style.transform = 'translateY(0)';
        multiTab.innerHTML = '<i class="fas fa-times text-xl"></i>';
      }, 10);
    } else {
      contactWidget.style.opacity = '0';
      contactWidget.style.transform = 'translateY(10px)';
      multiTab.innerHTML = '<i class="fas fa-comments text-xl"></i>';
      setTimeout(function () {
        contactWidget.style.display = 'none';
      }, 300);
    }
  }

  if (multiTab) {
    multiTab.addEventListener('click', toggleContactWidget);
  }

  window.toggleContactWidget = toggleContactWidget;

  function submitContactWithComments() {
    var form = document.querySelector('#contact-widget form');
    var responseDiv = document.getElementById('contact-response');
    if (!form || !responseDiv) return;
    var data = new FormData(form);

    if (!data.get('name') || !data.get('email') || !data.get('message')) {
      responseDiv.innerHTML = '<p class="text-red-500 text-sm">Please fill in all fields.</p>';
      return;
    }

    responseDiv.innerHTML = '<p class="text-yellow-600 text-sm">Sending...</p>';

    fetch('/', {
      method: 'POST',
      body: new URLSearchParams(data),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(function () {
        responseDiv.innerHTML = '<p class="text-green-500 text-sm">Thank you! Your message has been sent.</p>';
        form.reset();
        setTimeout(function () {
          toggleContactWidget();
          responseDiv.innerHTML = '';
        }, 2000);
      })
      .catch(function () {
        responseDiv.innerHTML = '<p class="text-red-500 text-sm">Something went wrong. Please try again.</p>';
      });
  }

  window.submitContactWithComments = submitContactWithComments;

  /* ---------------- Contact page form ---------------- */
  var contactForm = document.querySelector('form[name="contact"]');
  var contactStatus = document.getElementById('contact-form-status');
  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(contactForm);
      if (!data.get('name') || !data.get('email') || !data.get('message')) {
        contactStatus.innerHTML = '<p class="text-red-500 text-sm">Please fill in all required fields.</p>';
        return;
      }
      contactStatus.innerHTML = '<p class="text-yellow-600 text-sm">Sending...</p>';
      fetch('/', {
        method: 'POST',
        body: new URLSearchParams(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then(function () {
          contactStatus.innerHTML = '<p class="text-green-600 text-sm">Thank you! Your message has been sent. We will get back to you shortly.</p>';
          contactForm.reset();
        })
        .catch(function () {
          contactStatus.innerHTML = '<p class="text-red-500 text-sm">Something went wrong. Please try again or call us on 0719 151 288.</p>';
        });
    });
  }

  /* ---------------- Dynamic content (About page) ---------------- */
  function renderDynamicContent() {
    var valuesSection = document.querySelector('#values-grid');
    if (valuesSection && !valuesSection.hasAttribute('data-cms-rendered')) {
      var valuesData = [
        { icon: 'fas fa-eye', title: 'Transparency', desc: 'We value open and honest communication in all our interactions and business practices.' },
        { icon: 'fas fa-shield-halved', title: 'Integrity', desc: 'We uphold the highest standards of honesty and ethical conduct in all our dealings.' },
        { icon: 'fas fa-heart', title: 'Customer Focus', desc: 'We strive to provide exceptional service and exceed our customers\' expectations.' },
        { icon: 'fas fa-lightbulb', title: 'Innovation', desc: 'We continuously innovate to improve our products and services for better client experiences.' }
      ];
      valuesSection.innerHTML = '';
      valuesData.forEach(function (value) {
        var div = document.createElement('div');
        div.className = 'group card p-6 md:p-8 hover:shadow-card hover:-translate-y-1 hover:border hover:border-brand-gold/30';
        div.innerHTML =
          '<div class="icon-tile mb-5"><i class="' + value.icon + ' text-xl text-brand-gold"></i></div>' +
          '<h4 class="text-lg font-bold text-brand-dark mb-2">' + value.title + '</h4>' +
          '<p class="text-brand-muted leading-relaxed text-sm">' + value.desc + '</p>';
        valuesSection.appendChild(div);
      });
    }

    var keyNumbersSection = document.querySelector('#key-numbers-grid');
    if (keyNumbersSection && !keyNumbersSection.hasAttribute('data-cms-rendered')) {
      var keyNumbersData = [
        { value: '12+', label: 'Insurance Partners' },
        { value: '99.7%', label: 'Customer Satisfaction' },
        { value: '7', label: 'National Awards' },
        { value: '234+', label: 'Clients Covered' }
      ];
      keyNumbersSection.innerHTML = '';
      keyNumbersData.forEach(function (item) {
        var div = document.createElement('div');
        div.className = 'text-center group';
        div.innerHTML =
          '<div class="bg-white/5 rounded-xl p-6 md:p-8 group-hover:bg-white/10 transition-all duration-300 border border-white/5">' +
          '<div class="text-4xl md:text-5xl font-display text-brand-gold mb-2">' + item.value + '</div>' +
          '<p class="text-base md:text-lg text-white/50">' + item.label + '</p></div>';
        keyNumbersSection.appendChild(div);
      });
    }
  }

  /* ---------------- Init ---------------- */
  initReveal();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderDynamicContent);
  } else {
    renderDynamicContent();
  }

  window.GS = {
    hero: initHeroSlider,
    testimonials: initTestimonials,
    faq: initFaq,
    reveal: initReveal,
    renderDynamic: renderDynamicContent
  };
})();
