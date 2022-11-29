$(() => {
	const textMotions = $('[data-motion="text"]');
	textMotions.each(function() {
		const text = $(this);
		const index = text.index();
		const delay = parseFloat(text.attr('data-delay') || "0");
		const html = text.html();

		text.html(`<span class="motion"><span class="motion-content">${html}</span></span>`);

		text.removeAttr('data-motion');
		text.removeAttr('data-delay');

		text.find('.motion-content').css({
			'transition': 'transform 800ms ' + (index * 150 + delay) + 'ms'
		});
	});
});

$(() => {
	const contentMotions = $('[data-motion="content"]');
	contentMotions.each(function() {
		const content = $(this);
		const index = content.index();
		const delay = parseFloat(content.attr('data-delay') || "0");

		content.removeAttr('data-delay');

		content.css({
			'transition': 'transform 800ms ' + (index * 75 + delay) + 'ms, ' + 'opacity 800ms ' + (index * 75 + delay) + 'ms'
		});
	});
});

$(() => {
	let elements = $('main section, article');

	function detect() {
		const height = document.documentElement.clientHeight;
		const scrollY = window.scrollY;

		elements.each(function() {
			const element = $(this);
			const offsetTop = element.offset().top;

			const absolute = height + scrollY - offsetTop;
			const relative = absolute / height;

			if (absolute >= 400 || relative >= 0.4) {
				element.addClass('on');
			}
		});

		elements = elements.filter(function() {
			return !$(this).hasClass('on');
		});

		if (!elements.length) {
			$(window).off('scroll resize', detect);
		}
	}

	$(window).on('load', detect);
	$(window).on('scroll resize', detect);
});

$(() => {
	const header = $('header');

	function slideTo(scrollY) {
		$('html').stop().animate({'scrollTop': scrollY}, scrollY / 10 + 200);
	}

	function getScroll(element) {
		return Math.max(0, element.offset().top - header.height());
	}

	$(window).on('load', () => {
		if (location.hash) {
			const element = $(location.hash);
	
			if (element.length) {
				slideTo(getScroll(element));
			}
		}
		history.pushState(null, null, location.pathname + location.search);
	});

	header.on('click', 'a', function(event) {
		const link = $(this);
		const target = link.attr('href');

		if (target === '#') {
			slideTo(0);
		} else {
			const element = $(target);

			if (element.length) {
				slideTo(getScroll(element));
			}
		}

		event.preventDefault();
	});
});

$(() => {
	const loginBtn = $('.btn-login');

	loginBtn.on('click', () => {
		const text = loginBtn.text();

		if (text === 'Login') {
			const loginTemplate = $('#loginForm');
			const template = document.createElement('template');
			const main = $('main');

			template.innerHTML = loginTemplate.html();

			const loginForm = template.content.children[0];
			loginForm.style.opacity = '0';
			loginForm.style.transition = 'opacity 400ms';

			setTimeout(() => {
				loginForm.style.opacity = '1';

				if (loginSubmit.querySelector('#userid')) {
					loginSubmit.querySelector('#userid').focus();
				}
			}, 10);

			loginForm.addEventListener('click', (event) => {
				if (event.target === loginForm) {
					loginForm.style.opacity = '0';

					setTimeout(() => {
						$(loginForm).remove();
					}, 400);
				}
			});

			const loginSubmit = loginForm.querySelector('form');
			loginSubmit.addEventListener('submit', (event) => {
				event.preventDefault();

				const userId = loginSubmit.querySelector('#userid');
				const userPassword = loginSubmit.querySelector('#userpw');

				if (userId.value === 'admin' && userPassword.value === 'admin') {
					$(loginForm).remove();
					loginBtn.text('Logout');
				} else {
					alert('ID 또는 Password 가 올바르지 않습니다.');
				}
			});

			main.append(loginForm);
		} else {
			loginBtn.text('Login');
		}
	});
});

$(() => {
	const makeProcess = $('#make-process');
	if (makeProcess.length) {
		const slideWrapper = makeProcess.find('.slide-wrapper');
		const slideContent = slideWrapper.find('.slide-content');
		const prevBtn = slideWrapper.find('.btn-prev');
		const nextBtn = slideWrapper.find('.btn-next');

		let state = {
			currentIndex: 0,
			idle: true,
			count: slideContent.find('figure').length,
			duration: 400,
		};

		function slide(index) {
			if (index === state.currentIndex || index < 0 || index >= state.count || !state.idle) {
				return;
			}

			state.idle = false;
			slideContent.css({'transition': `transform ${state.duration}ms`, 'transform': `translateX(-${index * 100}%)`});

			if (index === 0) {
				prevBtn.attr('disabled', true);
			} else {
				prevBtn.removeAttr('disabled');
			}
			
			if (index === state.count - 1) {
				nextBtn.attr('disabled', true);
			} else {
				nextBtn.removeAttr('disabled');
			}

			state.currentIndex = index;
			setTimeout(() => {
				state.idle = true;
			}, state.duration);
		}

		prevBtn.on('click', () => {
			slide(state.currentIndex - 1);
		});

		nextBtn.on('click', () => {
			slide(state.currentIndex + 1);
		});

		$(document.documentElement).on('keydown', (event) => {
			const offsetTop = slideWrapper.offset().top;
			const wrapperHeight = slideWrapper.height();
			const scrollTop = $(window).scrollTop();
			const windowHeight = $(window).height();

			if (
				(
					offsetTop >= scrollTop
					&& offsetTop < scrollTop + windowHeight
				) ||
				(
					offsetTop + wrapperHeight >= scrollTop
					&& offsetTop + wrapperHeight < scrollTop + windowHeight
				) ||
				(
					offsetTop < scrollTop + windowHeight
					&& offsetTop + wrapperHeight >= scrollTop
				)
			) {
				if (event.keyCode === 37) {
					prevBtn.click();
				}
				if (event.keyCode === 39) {
					nextBtn.click();
				}
			}
		});
	}
});

$(() => {
	const modeling3D = $('#modeling-3d');
	if (modeling3D.length) {
		const imageData = modeling3D.find('figure');
		const copyImageData = imageData.clone().map(function() {
			this.removeAttribute('data-motion');
			this.removeAttribute('style');
			return this;
		});
		const view = modeling3D.find('.object-view');
		view.html(`
		<div class="slide-wrapper">
			<div class="slide-content"></div>
			<div class="slide-control">
				<button class="btn-prev" type="button" disabled>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
					</svg>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
						<path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
					</svg>
				</button>
				<button class="btn-next" type="button">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
					</svg>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
						<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
					</svg>
				</button>
			</div>
		</div>
		`);

		const slideWrapper = view.find('.slide-wrapper');
		const slideContent = slideWrapper.find('.slide-content');
		const prevBtn = slideWrapper.find('.btn-prev');
		const nextBtn = slideWrapper.find('.btn-next');

		slideContent.append(copyImageData);

		let state = {
			currentIndex: 0,
			idle: true,
			count: slideContent.find('figure').length,
			duration: 400,
		};

		function slide(index) {
			if (index === state.currentIndex || index < 0 || index >= state.count || !state.idle) {
				return;
			}

			state.idle = false;
			slideContent.css({'transition': `transform ${state.duration}ms`, 'transform': `translateX(-${index * 100}%)`});

			if (index === 0) {
				prevBtn.attr('disabled', true);
			} else {
				prevBtn.removeAttr('disabled');
			}
			
			if (index === state.count - 1) {
				nextBtn.attr('disabled', true);
			} else {
				nextBtn.removeAttr('disabled');
			}

			state.currentIndex = index;
			setTimeout(() => {
				state.idle = true;
			}, state.duration);
		}

		prevBtn.on('click', () => {
			slide(state.currentIndex - 1);
		});

		nextBtn.on('click', () => {
			slide(state.currentIndex + 1);
		});

		$(document.documentElement).on('keydown', (event) => {
			const offsetTop = slideWrapper.offset().top;
			const wrapperHeight = slideWrapper.height();
			const scrollTop = $(window).scrollTop();
			const windowHeight = $(window).height();

			if (
				(
					offsetTop >= scrollTop
					&& offsetTop < scrollTop + windowHeight
				) ||
				(
					offsetTop + wrapperHeight >= scrollTop
					&& offsetTop + wrapperHeight < scrollTop + windowHeight
				) ||
				(
					offsetTop < scrollTop + windowHeight
					&& offsetTop + wrapperHeight >= scrollTop
				)
			) {
				if (event.keyCode === 37) {
					prevBtn.click();
				}
				if (event.keyCode === 39) {
					nextBtn.click();
				}
			}
		});

		const buttons = modeling3D.find('.object-list button');
		buttons.on('click', function() {
			const button = $(this);
			const index = button.index();

			if (view.hasClass('active')) {
				if (index === state.currentIndex) {
					view.removeClass('active');
					return;
				}
			} else {
				view.addClass('active');
			}

			slide(index);
		});
	}
});
