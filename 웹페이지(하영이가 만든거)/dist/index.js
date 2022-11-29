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
