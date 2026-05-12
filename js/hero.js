(function() {
  var $$ = function(selector, context) {
    var context = context || document;
    var elements = context.querySelectorAll(selector);
    return [].slice.call(elements);
  };

  function _fncSliderInit($slider, options) {
    var prefix = ".fnc-";
    var $slider = $slider;
    var $slidesCont = $slider.querySelector(prefix + "slider__slides");
    var $slides = $$(prefix + "slide", $slider);
    var $controls = $$(prefix + "nav__control", $slider);
    var $controlsBgs = $$(prefix + "nav__bg", $slider);
    var $progressAS = $$(prefix + "nav__control-progress", $slider);

    var numOfSlides = $slides.length;
    var curSlide = 1;
    var sliding = false;
    var slidingAT = +parseFloat(getComputedStyle($slidesCont)["transition-duration"]) * 1000;
    var slidingDelay = +parseFloat(getComputedStyle($slidesCont)["transition-delay"]) * 1000;

    var autoSlidingActive = false;
    var autoSlidingTO;
    var autoSlidingDelay = 5000;
    var autoSlidingBlocked = false;

    var $activeSlide;
    var $activeControlsBg;
    var $prevControl;

    function setIDs() {
      $slides.forEach(function($slide, index) {
        $slide.classList.add("fnc-slide-" + (index + 1));
      });
      $controls.forEach(function($control, index) {
        $control.setAttribute("data-slide", index + 1);
        $control.classList.add("fnc-nav__control-" + (index + 1));
      });
      $controlsBgs.forEach(function($bg, index) {
        $bg.classList.add("fnc-nav__bg-" + (index + 1));
      });
    }

    setIDs();

    function afterSlidingHandler() {
      var prevSlide = $slider.querySelector(".m--previous-slide");
      var prevBg = $slider.querySelector(".m--previous-nav-bg");
      if (prevSlide) prevSlide.classList.remove("m--active-slide", "m--previous-slide");
      if (prevBg) prevBg.classList.remove("m--active-nav-bg", "m--previous-nav-bg");

      $activeSlide.classList.remove("m--before-sliding");
      $activeControlsBg.classList.remove("m--nav-bg-before");
      $prevControl.classList.remove("m--prev-control");
      $prevControl.classList.add("m--reset-progress");
      var triggerLayout = $prevControl.offsetTop;
      $prevControl.classList.remove("m--reset-progress");

      sliding = false;
      var layoutTrigger = $slider.offsetTop;

      if (autoSlidingActive && !autoSlidingBlocked) {
        setAutoslidingTO();
      }
    }

    function performSliding(slideID) {
      if (sliding) return;
      sliding = true;
      window.clearTimeout(autoSlidingTO);
      curSlide = slideID;

      $prevControl = $slider.querySelector(".m--active-control");
      if ($prevControl) {
        $prevControl.classList.remove("m--active-control");
        $prevControl.classList.add("m--prev-control");
      }
      var newControl = $slider.querySelector(prefix + "nav__control-" + slideID);
      if (newControl) newControl.classList.add("m--active-control");

      $activeSlide = $slider.querySelector(prefix + "slide-" + slideID);
      $activeControlsBg = $slider.querySelector(prefix + "nav__bg-" + slideID);

      var curActiveSlide = $slider.querySelector(".m--active-slide");
      var curActiveBg = $slider.querySelector(".m--active-nav-bg");
      if (curActiveSlide) curActiveSlide.classList.add("m--previous-slide");
      if (curActiveBg) curActiveBg.classList.add("m--previous-nav-bg");

      if ($activeSlide) $activeSlide.classList.add("m--before-sliding");
      if ($activeControlsBg) $activeControlsBg.classList.add("m--nav-bg-before");

      var layoutTrigger = $activeSlide ? $activeSlide.offsetTop : 0;

      if ($activeSlide) $activeSlide.classList.add("m--active-slide");
      if ($activeControlsBg) $activeControlsBg.classList.add("m--active-nav-bg");

      setTimeout(afterSlidingHandler, slidingAT + slidingDelay);
    }

    function controlClickHandler() {
      if (sliding) return;
      if (this.classList.contains("m--active-control")) return;
      if (options.blockASafterClick) {
        autoSlidingBlocked = true;
        $slider.classList.add("m--autosliding-blocked");
      }
      var slideID = +this.getAttribute("data-slide");
      performSliding(slideID);
    }

    $controls.forEach(function($control) {
      $control.addEventListener("click", controlClickHandler);
    });

    function setAutoslidingTO() {
      window.clearTimeout(autoSlidingTO);
      var delay = +options.autoSlidingDelay || autoSlidingDelay;
      curSlide++;
      if (curSlide > numOfSlides) curSlide = 1;
      autoSlidingTO = setTimeout(function() {
        performSliding(curSlide);
      }, delay);
    }

    if (options.autoSliding || +options.autoSlidingDelay > 0) {
      if (options.autoSliding === false) return;
      autoSlidingActive = true;
      setAutoslidingTO();
      $slider.classList.add("m--with-autosliding");
      var triggerLayout = $slider.offsetTop;
      var delay = +options.autoSlidingDelay || autoSlidingDelay;
      delay += slidingDelay + slidingAT;
      $progressAS.forEach(function($progress) {
        $progress.style.transition = "transform " + (delay / 1000) + "s";
      });
    }

    var firstControl = $slider.querySelector(".fnc-nav__control:first-child");
    if (firstControl) firstControl.classList.add("m--active-control");
  }

  var fncSlider = function(sliderSelector, options) {
    var $sliders = $$(sliderSelector);
    $sliders.forEach(function($slider) {
      _fncSliderInit($slider, options);
    });
  };

  window.fncSlider = fncSlider;
}());

var sliderEl = document.querySelector(".example-slider");
if (sliderEl) {
  fncSlider(".example-slider", {autoSlidingDelay: 4000});
}

var $demoCont = document.querySelector(".demo-cont");
if ($demoCont) {
  [].slice.call(document.querySelectorAll(".fnc-slide__action-btn")).forEach(function($btn) {
    $btn.addEventListener("click", function() {
      $demoCont.classList.toggle("credits-active");
    });
  });

  var creditsClose = document.querySelector(".demo-cont__credits-close");
  if (creditsClose) {
    creditsClose.addEventListener("click", function() {
      $demoCont.classList.remove("credits-active");
    });
  }

  var globalBlending = document.querySelector(".js-activate-global-blending");
  if (globalBlending) {
    globalBlending.addEventListener("click", function() {
      document.querySelector(".example-slider").classList.toggle("m--global-blending-active");
    });
  }
}
