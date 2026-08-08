(function () {
  'use strict';

  var config = window.GREATSCOPE_SANITY || {};
  if (!config.projectId || !config.dataset) return; // no CMS configured -> hardcoded fallback stays

  var API_VERSION = '2026-02-01';
  var CDN =
    'https://' + config.projectId + '.apicdn.sanity.io/v' + API_VERSION +
    '/data/query/' + encodeURIComponent(config.dataset);

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function safeUrl(u) {
    if (!u) return '';
    var s = String(u).trim();
    if (/^(https?:)?\/\//.test(s)) return s;
    return '';
  }

  function q(groq) {
    return fetch(CDN + '?query=' + encodeURIComponent(groq), { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('Sanity ' + r.status);
        return r.json();
      })
      .then(function (d) {
        return d.result;
      });
  }

  var QUERIES = {
    siteSettings: '*[_type == "siteSettings"][0]',
    homePage: '*[_type == "homePage"][0]',
    categories: '*[_type == "productCategory"] | order(order asc){ _id, title, "slug": slug.current, icon, description, bannerImageUrl, order }',
    products: '*[_type == "product"]{ _id, key, title, description, imageUrl, order, "category": category->slug.current }',
    partners: '*[_type == "partner"] | order(order asc){ name, logoUrl, order }',
    testimonials: '*[_type == "testimonial"] | order(order asc){ name, location, quote, rating, avatarUrl, order }',
    faqs: '*[_type == "faq"] | order(order asc){ question, answer, order }',
    about: '*[_type == "aboutPage"][0]'
  };

  function renderHero(slides) {
    var wrap = document.querySelector('.hero-slides');
    if (!wrap || !slides || !slides.length) return;
    Array.prototype.slice.call(wrap.querySelectorAll('.hero-slide')).forEach(function (s) {
      s.parentNode.removeChild(s);
    });
    var cta = document.querySelector('[data-cms="whatsapp"]');
    var wa = (cta && cta.getAttribute('href')) || 'https://wa.me/254719151288';

    var dotsNode = wrap.querySelector('.hero-dots');
    var refNode = dotsNode ? dotsNode.parentNode.parentNode : null; // outer controls wrapper (direct child of .hero-slides)

    slides.forEach(function (slide, i) {
      var tag = i === 0 ? 'h1' : 'h2';
      var src = safeUrl(slide.imageUrl);
      var div = document.createElement('div');
      div.className = 'hero-slide' + (i === 0 ? ' active' : '') + ' absolute inset-0';
      div.setAttribute('role', 'group');
      div.setAttribute('aria-roledescription', 'slide');
      div.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);
      div.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
      div.innerHTML =
        '<div class="absolute inset-0">' +
        '<img src="' + esc(src) + '" sizes="100vw" alt="" class="w-full h-full object-cover"' +
        (i === 0 ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">' +
        '<div class="absolute inset-0 bg-brand-darker/85"></div>' +
        '</div>' +
        '<div class="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">' +
        '<div class="max-w-2xl">' +
        '<span class="text-brand-gold font-semibold text-xs uppercase tracking-[0.25em]">' + esc(slide.label) + '</span>' +
        '<' + tag + ' class="text-4xl sm:text-5xl md:text-7xl font-display text-white mt-6 mb-6 leading-[1.05]">' + esc(slide.title) + '</' + tag + '>' +
        '<p class="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed mb-10">' + esc(slide.subtitle) + '</p>' +
        '<div class="flex flex-wrap gap-4">' +
        '<a href="' + esc(wa) + '" target="_blank" rel="noopener noreferrer" class="btn-gold"><i class="fab fa-whatsapp text-xl"></i> Get a Quote</a>' +
        '<a href="' + esc(slide.exploreHref || 'insurance.html') + '" class="btn-outline-light">Explore Products <i class="fas fa-arrow-right text-sm"></i></a>' +
        '</div>' +
        '</div>' +
        '</div>';
      wrap.insertBefore(div, refNode);
    });
    if (window.GS && window.GS.hero) window.GS.hero();
  }

  function renderCards(targetSel, items, cardFn) {
    var wrap = document.querySelector(targetSel);
    if (!wrap || !items || !items.length) return;
    wrap.innerHTML = '';
    items.forEach(function (item, i) {
      wrap.appendChild(cardFn(item, i));
    });
  }

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function renderHome(page) {
    if (!page) return;

    if (Array.isArray(page.services) && page.services.length) {
      renderCards('[data-cms="services"]', page.services, function (s) {
        return el(
          '<a href="' + esc(s.href || 'insurance.html') + '" class="group block card gold-card p-8 md:p-10 hover:shadow-card hover:-translate-y-1.5">' +
          '<div class="icon-tile mb-6"><i class="' + esc(s.icon) + ' text-xl text-brand-gold"></i></div>' +
          '<h3 class="text-2xl font-display text-brand-dark mb-4">' + esc(s.title) + '</h3>' +
          '<p class="text-brand-muted leading-relaxed text-sm">' + esc(s.description) + '</p>' +
          '<span class="inline-flex items-center mt-6 text-brand-dark font-semibold text-sm group-hover:translate-x-2 transition-transform">View Covers <i class="fas fa-arrow-right ml-2 text-xs"></i></span>' +
          '</a>'
        );
      });
    }

    if (Array.isArray(page.howItWorks) && page.howItWorks.length) {
      renderCards('[data-cms="how-it-works"]', page.howItWorks, function (s, i) {
        return el(
          '<div class="card gold-card p-8 md:p-10 text-center">' +
          '<div class="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-6"><i class="' + esc(s.icon) + ' text-2xl text-brand-gold"></i></div>' +
          '<span class="text-xs font-bold tracking-[0.2em] text-brand-gold uppercase">Step 0' + (i + 1) + '</span>' +
          '<h3 class="text-2xl font-display text-brand-dark mt-3 mb-3">' + esc(s.title) + '</h3>' +
          '<p class="text-brand-muted leading-relaxed text-sm">' + esc(s.description) + '</p>' +
          '</div>'
        );
      });
    }

    if (Array.isArray(page.whyUs) && page.whyUs.length) {
      renderCards('[data-cms="why-us"]', page.whyUs, function (s) {
        return el(
          '<div class="flex items-start gap-4">' +
          '<div class="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center flex-shrink-0"><i class="' + esc(s.icon) + ' text-brand-gold"></i></div>' +
          '<div><h3 class="font-display text-brand-dark mb-2 text-xl">' + esc(s.title) + '</h3>' +
          '<p class="text-brand-muted text-sm">' + esc(s.description) + '</p></div>' +
          '</div>'
        );
      });
    }

    if (Array.isArray(page.stats) && page.stats.length) {
      renderCards('[data-cms="stats"]', page.stats, function (s) {
        return el(
          '<div class="text-center"><div class="text-3xl md:text-4xl font-display text-brand-gold">' + esc(s.value) + '</div>' +
          '<p class="text-white/50 text-sm mt-1">' + esc(s.label) + '</p></div>'
        );
      });
    }
  }

  function renderPartners(partners) {
    if (!partners || !partners.length) return;
    renderCards('[data-cms="partners"]', partners, function (p) {
      return el(
        '<img src="' + esc(safeUrl(p.logoUrl)) + '" alt="' + esc(p.name) + '" loading="lazy" width="120" height="60" class="partner-logo">'
      );
    });
  }

  function stars(rating) {
    var n = Number(rating) || 0;
    var full = Math.floor(n);
    var half = n - full >= 0.5;
    var s = '';
    for (var i = 0; i < full; i++) s += '★';
    if (half) s += '½';
    return s;
  }

  function renderTestimonials(items) {
    if (!items || !items.length) return;
    var wrap = document.querySelector('[data-cms="testimonials"]');
    if (!wrap) return;
    wrap.innerHTML = '';
    items.forEach(function (t, i) {
      var item = el(
        '<div class="testimonial-item' + (i === 0 ? '' : ' hidden') + '">' +
        '<p class="text-lg md:text-xl text-white/70 italic mb-8 leading-relaxed">"' + esc(t.quote) + '"</p>' +
        '<div class="flex items-center justify-center gap-4 mb-4">' +
        '<img src="' + esc(safeUrl(t.avatarUrl)) + '" alt="' + esc(t.name) + '" class="w-12 h-12 rounded-full object-cover border-2 border-brand-gold">' +
        '<div class="text-left"><span class="block font-semibold text-white">' + esc(t.name) + '</span>' +
        '<p class="text-sm text-white/50">' + esc(t.location) + '</p></div>' +
        '</div>' +
        '<div class="text-brand-gold">' + stars(t.rating) + '</div>' +
        '</div>'
      );
      wrap.appendChild(item);
    });
    if (window.GS && window.GS.testimonials) window.GS.testimonials();
  }

  function renderProducts(categories, products) {
    if (!categories || !products) return;
    var wa = 'https://wa.me/254719151288';
    var w = document.querySelector('[data-cms="whatsapp"]');
    if (w) wa = w.getAttribute('href') || wa;

    categories.forEach(function (cat) {
      var slug = cat.slug || String(cat._id);
      var section = document.getElementById(slug);
      if (!section) return;
      var banner = section.querySelector('.relative.rounded-3xl');
      if (banner) {
        var img = banner.querySelector('img');
        if (img && cat.bannerImageUrl) img.setAttribute('src', safeUrl(cat.bannerImageUrl));
        var icon = banner.querySelector('i');
        if (icon && cat.icon) icon.className = cat.icon + ' text-lg md:text-2xl text-brand-dark';
        var title = banner.querySelector('h3');
        if (title) title.textContent = cat.title;
      }
      var grid = section.querySelector('.grid');
      if (!grid) return;
      var list = products
        .filter(function (p) { return p.category === slug; })
        .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
      grid.innerHTML = '';
      list.forEach(function (p) {
        grid.appendChild(
          el(
            '<div class="group card overflow-hidden hover:shadow-card hover:-translate-y-1">' +
            '<div class="relative aspect-[4/3] overflow-hidden">' +
            '<img src="' + esc(safeUrl(p.imageUrl)) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">' +
            '<div class="absolute inset-0 bg-gradient-to-t from-brand-darker/30 to-transparent"></div>' +
            '</div>' +
            '<div class="p-6">' +
            '<h4 class="text-lg font-bold text-brand-dark mb-2">' + esc(p.title) + '</h4>' +
            '<p class="text-brand-muted text-sm leading-relaxed mb-4">' + esc(p.description) + '</p>' +
            '<a href="' + esc(wa) + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-brand-dark font-semibold text-sm transition-all">Get a Quote <i class="fas fa-arrow-right text-xs"></i></a>' +
            '</div>' +
            '</div>'
          )
        );
      });
    });
  }

  function renderFaq(faqs) {
    if (!faqs || !faqs.length) return;
    var wrap = document.querySelector('[data-cms="faq"]');
    if (!wrap) return;
    wrap.innerHTML = '';
    faqs.forEach(function (f, i) {
      wrap.appendChild(
        el(
          '<div class="faq bg-white/5 rounded-xl overflow-hidden cursor-pointer border border-white/10">' +
          '<div class="question flex justify-between items-center p-5 md:p-6" role="button" tabindex="0" aria-expanded="false">' +
          '<h3 class="text-base md:text-lg font-semibold text-white pr-4">' + (i + 1) + '. ' + esc(f.question) + '</h3>' +
          '<i class="fas fa-chevron-down text-brand-gold transition-transform duration-300 flex-shrink-0"></i>' +
          '</div>' +
          '<div class="answer overflow-hidden transition-all duration-300" style="max-height: 0;">' +
          '<p class="px-5 md:px-6 pb-5 md:pb-6 text-white/60 text-sm leading-relaxed">' + esc(f.answer) + '</p>' +
          '</div>' +
          '</div>'
        )
      );
    });
    if (window.GS && window.GS.faq) window.GS.faq();

    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    Array.prototype.forEach.call(scripts, function (s) {
      if (s.textContent.indexOf('FAQPage') === -1) return;
      var data = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(function (f) {
          return {
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer }
          };
        })
      };
      s.textContent = JSON.stringify(data);
    });
  }

  function renderAbout(about) {
    if (!about) return;
    var leader = document.querySelector('[data-cms="leader"]');
    if (leader) {
      var img = leader.querySelector('img');
      if (img && about.leaderImageUrl) img.setAttribute('src', safeUrl(about.leaderImageUrl));
      var name = leader.querySelector('h3');
      if (name) name.textContent = about.leaderName || name.textContent;
      var role = leader.querySelector('.text-lg');
      if (role && about.leaderTitle) role.textContent = about.leaderTitle;
      var bioWrap = leader.querySelector('.space-y-4');
      if (bioWrap && Array.isArray(about.leaderBio) && about.leaderBio.length) {
        bioWrap.innerHTML = '';
        about.leaderBio.forEach(function (p) {
          var el = document.createElement('p');
          el.className = 'leading-relaxed';
          el.textContent = p;
          bioWrap.appendChild(el);
        });
      }
    }
    var textWrap = document.querySelector('[data-cms="about-text"]');
    if (textWrap && Array.isArray(about.aboutParagraphs) && about.aboutParagraphs.length) {
      textWrap.innerHTML = '';
      about.aboutParagraphs.forEach(function (p) {
        var el = document.createElement('p');
        el.textContent = p;
        textWrap.appendChild(el);
      });
    }
    var vision = document.querySelector('[data-cms="vision"]');
    if (vision) {
      var vt = vision.querySelector('h3');
      if (vt && about.visionTitle) vt.textContent = about.visionTitle;
      var vp = vision.querySelector('p');
      if (vp && about.visionText) vp.textContent = about.visionText;
    }
    var mission = document.querySelector('[data-cms="mission"]');
    if (mission) {
      var mt = mission.querySelector('h3');
      if (mt && about.missionTitle) mt.textContent = about.missionTitle;
      var mp = mission.querySelector('p');
      if (mp && about.missionText) mp.textContent = about.missionText;
    }
    var values = document.querySelector('#values-grid');
    if (values && Array.isArray(about.values) && about.values.length) {
      values.setAttribute('data-cms-rendered', '1');
      values.innerHTML = '';
      about.values.forEach(function (v) {
        values.appendChild(
          el(
            '<div class="group card p-6 md:p-8 hover:shadow-card hover:-translate-y-1 hover:border hover:border-brand-gold/30">' +
            '<div class="icon-tile mb-5"><i class="' + esc(v.icon) + ' text-xl text-brand-gold"></i></div>' +
            '<h4 class="text-lg font-bold text-brand-dark mb-2">' + esc(v.title) + '</h4>' +
            '<p class="text-brand-muted leading-relaxed text-sm">' + esc(v.description) + '</p>' +
            '</div>'
          )
        );
      });
    }
    var keyNumbers = document.querySelector('#key-numbers-grid');
    if (keyNumbers && Array.isArray(about.keyNumbers) && about.keyNumbers.length) {
      keyNumbers.setAttribute('data-cms-rendered', '1');
      keyNumbers.innerHTML = '';
      about.keyNumbers.forEach(function (k) {
        keyNumbers.appendChild(
          el(
            '<div class="text-center group"><div class="bg-white/5 rounded-xl p-6 md:p-8 group-hover:bg-white/10 transition-all duration-300 border border-white/5">' +
            '<div class="text-4xl md:text-5xl font-display text-brand-gold mb-2">' + esc(k.value) + '</div>' +
            '<p class="text-base md:text-lg text-white/50">' + esc(k.label) + '</p></div></div>'
          )
        );
      });
    }
  }

  function renderSiteSettings(s) {
    if (!s) return;
    function setAll(sel, fn) {
      document.querySelectorAll(sel).forEach(fn);
    }
    if (s.phone1 && s.phone1Tel) {
      setAll('[data-cms="phone1"]', function (el) {
        el.setAttribute('href', 'tel:' + s.phone1Tel);
        el.textContent = s.phone1;
      });
    }
    if (s.phone2 && s.phone2Tel) {
      setAll('[data-cms="phone2"]', function (el) {
        el.setAttribute('href', 'tel:' + s.phone2Tel);
        el.textContent = s.phone2;
      });
    }
    if (s.email) setAll('[data-cms="email-text"]', function (el) { el.textContent = s.email; });
    if (s.address) setAll('[data-cms="address"]', function (el) { el.textContent = s.address; });
    if (s.hours) setAll('[data-cms="hours"]', function (el) { el.textContent = s.hours; });
    if (s.footerText) setAll('[data-cms="footer-text"]', function (el) { el.textContent = s.footerText; });
    if (s.whatsapp) {
      var digits = String(s.whatsapp).replace(/\D/g, '');
      if (digits) setAll('[data-cms="whatsapp"]', function (el) { el.setAttribute('href', 'https://wa.me/' + digits); });
    }
    if (Array.isArray(s.socials)) {
      s.socials.forEach(function (soc) {
        if (!soc.label || !soc.url) return;
        var key = String(soc.label).toLowerCase().replace(/[^a-z0-9]/g, '');
        setAll('[data-cms="social-' + key + '"]', function (a) {
          a.setAttribute('href', safeUrl(soc.url));
        });
      });
    }
  }

  function init() {
    Promise.all([
      q(QUERIES.siteSettings).catch(function () { return null; }),
      q(QUERIES.homePage).catch(function () { return null; }),
      q(QUERIES.categories).catch(function () { return []; }),
      q(QUERIES.products).catch(function () { return []; }),
      q(QUERIES.partners).catch(function () { return []; }),
      q(QUERIES.testimonials).catch(function () { return []; }),
      q(QUERIES.faqs).catch(function () { return []; }),
      q(QUERIES.about).catch(function () { return null; })
    ])
      .then(function (results) {
        var siteSettings = results[0];
        var homePage = results[1];
        var categories = results[2];
        var products = results[3];
        var partners = results[4];
        var testimonials = results[5];
        var faqs = results[6];
        var about = results[7];

        renderSiteSettings(siteSettings);
        renderHero(homePage ? homePage.heroSlides : null);
        renderHome(homePage);
        renderPartners(partners);
        renderTestimonials(testimonials);
        renderProducts(categories, products);
        renderFaq(faqs);
        renderAbout(about);
      })
      .catch(function (err) {
        // Any failure -> keep the hardcoded fallback content.
        if (window.console) console.warn('[cms] Sanity content unavailable, using fallback:', err && err.message);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
