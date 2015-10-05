(function() {

// HEADER TRANSFORMATION

	(function() {
		var isTransformed;

		headerTransform();

		window.onscroll = function() {
			headerTransform();
		}

		function headerTransform() {

			var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

			if (scrollTop < 100 && !isTransformed) { return; }
			if (scrollTop < 100 && isTransformed) { 
				document.querySelector('.header__in').classList.remove('header__in_transformed');
				document.querySelector('.header').style.backgroundColor = '';
				isTransformed = null;
			}

			if (scrollTop > 100 && isTransformed) { return; }
			if (scrollTop > 100 && !isTransformed) { 
				document.querySelector('.header__in').classList.add('header__in_transformed');
				document.querySelector('.header').style.backgroundColor = 'black';
				isTransformed = true;
			}
		}
	})();

	(function(){
		function Slider(options) {
			var slider = options.slider;
			var controls = options.controls;
			var bindingElem;
			var windowSizeIs1170;
			var slides = slider.querySelectorAll('.slide');
			var controlsArr = controls.getElementsByTagName('i');
			var initialSlide = options.initialSlide || 0;
			var currentSlide = slides[initialSlide];
			var previousSlide = slides[initialSlide];

			slider.removeChild(controls);
			document.body.appendChild(controls);

			activateSlide();
			window.onload = function() {
				bindControls();
			}
			controls.onclick = function(e) {
				var target = e.target;
				if (target.tagName == 'I') {
					changeSlide(target);
				}
				return;
			}

				window.onresize = function() {
					setTimeout(function() {
						bindControls();
					}, 500);
				}

			function changeSlide(target) {
				if (target.classList.contains('testimonials__control_active')) {
					return;
				}

				for (var i = 0; i < target.parentNode.children.length; i++) {
					if (target.parentNode.children[i].classList.contains('testimonials__control_active')) {
						slides[i].classList.remove('slide_state_visible');
						target.parentNode.children[i].classList.remove('testimonials__control_active');
					}

					if (target.parentNode.children[i] == target) {
						slides[i].classList.toggle('slide_state_visible');
						controlsArr[i].classList.toggle('testimonials__control_active');
					}
					setTimeout(function() {
						bindControls();
					}, 500);
				}
				currentSlide = target
				//previousSlide.classList.toggle('slide_state_visible');
				//currentSlide.classList.toggle('slide_state_visible');
			}

			function bindControls() {
				bindingElem = slider.querySelector('.slide_state_visible').querySelector('.slide__wrap');
				var bindingElemCoords = getCoords(bindingElem);
				controls.style.left = bindingElemCoords.left + (bindingElem.clientWidth / 2 - controls.offsetWidth / 2) + 'px';
				controls.style.top = bindingElemCoords.top + bindingElem.offsetHeight + 58 + 'px';
			}

			function activateSlide() {
				controlsArr[initialSlide].classList.add('testimonials__control_active');
				slides[initialSlide].classList.add("slide_state_visible");
			}
		}

		var slider = new Slider({
			slider: document.querySelector('.testimonials__slider'),
			controls: document.querySelector('.testimonials__controls'),
			//bindingElem: document.querySelector('.slide__wrap')
		});
	})();

// MOBILE NAV TOGGLE

	(function(){
		var mobileToggle = document.querySelector('.header__nav-toggle');
		var hamburger = document.querySelector('.header__hamb');
		var overlay = document.querySelector('.overlay');
		var header = document.querySelector('.header');
		var navigation = document.querySelector('.header__nav');

		mobileToggle.onclick = function() {

			toggleMobileNav();

			if (hamburger.classList.contains('header__hamb_active')) {
				navigation.onclick = function(e) {
					var target = e.target;

					if (target.tagName != 'A') {
						return;
					}

					removeMobileNav();
				}
			}

			function toggleMobileNav() {
				hamburger.classList.toggle('header__hamb_active');
				overlay.classList.toggle('overlay_active');
				header.classList.toggle('header_no-fixed');
				navigation.classList.toggle('header__nav_active');
				return false;
			}

			function removeMobileNav() {
				hamburger.classList.remove('header__hamb_active');
				overlay.classList.remove('overlay_active');
				header.classList.remove('header_no-fixed');
				navigation.classList.remove('header__nav_active');
			}
		}
	})();


	// GET COORDS OF THE ELEMENT

	function getCoords(elem) {
		var elemCoords = elem.getBoundingClientRect();

		return {
			top: elemCoords.top + pageYOffset,
			left: elemCoords.left + pageXOffset
		};
	}
})();