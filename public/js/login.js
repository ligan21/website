	var _mel = $('material-card'),
			_el = $('.intro-card'),
			_rel = $('.intro-card-registration'),
			_fo = $('.material-input'),
			hasFocus = false;

	_fo.focus(function() {
			_el.attr('formactive', 'true');
			hasFocus = true;
	}).blur(function() {
			_el.attr('formactive', 'false');
			hasFocus = false;
	});
	_el.click(function() {
			if (_el.hasClass('open') && _el.attr('formactive', 'false') && hasFocus == false) {
					$(this).removeClass('open').removeClass('z-5').addClass('z-2');
					$('.header-full, .appendBeforeContent').css({
							'visibility': 'visible'
					});
					$('.material-form').css({
							'visibility': 'hidden'
					});
					$(this).parent("body").removeClass('clicked');
			} else {
					$(this).addClass('open').removeClass('z-2').addClass('z-5');
					$('.material-form').css({
							'visibility': 'visible'
					});
					$('.header-full, .appendBeforeContent').css({
							'visibility': 'hidden'
					});
					$(this).parent("body").addClass('clicked');
			}
	});
	_rel.click(function() {
			if (_rel.hasClass('open')) {
					$(this).removeClass('open').removeClass('z-5').addClass('z-2');
					$('.header-full, .appendBeforeContent').css({
							'visibility': 'visible'
					});
					$('.material-form[toggles=registration]').css({
							'visibility': 'hidden'
					});
					$(this).parent("body").removeClass('clicked');
			} else {
					$(this).addClass('open').removeClass('z-2').addClass('z-5');
					$('.header-full, .appendBeforeContent').css({
							'visibility': 'hidden'
					});
					$('.material-form[toggles=registration]').css({
							'visibility': 'visible'
					});
					$(this).parent("body").addClass('clicked');
			}
	});