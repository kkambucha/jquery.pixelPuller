/*
* jquery.pixelPuller
* Zakovryashin Vadim
* https://bitbucket.org/jankovsky
*
* Using:
* $('.js-pixel-puller').pixelPuller();
*
* Required data-attributes:
*  - data-pixel-puller-onclick  or/and  data-pixel-puller-onvisible  or/and  data-pixel-puller-ontrigger - urls of pixel
*
* Optional data-attributes
*  - data-pixel-puller-repetition - For repeat get metrics by event. False by default, may be "onclick onvisible oncustom" (or combination).
*
*/

(function($){

	// public methods

	var methods = {
		init: function(options) {

			return this.each(function(){

				var $this = $(this),
					urls = {
						onclick: $this.data('pixel-puller-onclick'),
						onvisible: $this.data('pixel-puller-onvisible'),
						ontrigger: $this.data('pixel-puller-ontrigger')
					},
					repetitionStr = $this.data('pixel-puller-repetition'),
					repetitionsArr = getRepetitions(repetitionStr),
					repetitions = {
						onclick: false,
						onvisible: false,
						ontrigger: false
					},
					href = $this.attr('href'),
					isRepetitionEnabled,
					data = $this.data('pixelPuller'),
					i;

		         if (!data) {

		         	// catch params error
		         	if (!urls.onclick && !urls.onvisible && !urls.ontrigger) {
		         		console.group();
		         		console.log('Не определены обязательные data-аттрибуты для');
		         		console.log($this);
		         		console.groupEnd();
		         	}

		            // catch repeats
		            if (repetitionsArr.length) {
		            	for (i = 0; i < repetitionsArr.length; i++) {
		            		switch (repetitionsArr[i]) {
		            			case 'onclick':
		            				repetitions.onclick = true;
		            			break;
		            			case 'onvisible':
		            				repetitions.onvisible = true;
		            			break;
		            			case 'ontrigger':
		            				repetitions.ontrigger = true;
		            			break;
		            			default:
		            			break;
		            		}
		            	}
		            }

		            $this.data('pixelPuller', {
		            	target : $this,
		            	urls: urls,
		            	href: href,
		            	repetitions: repetitions,
		            	isVisibleAndPixelPulled: false,
		            	debounceTimer: null,
		            	debounceTime: 150 // debounce-time for optimize
		            });

		            // check events
		            if (urls.onclick && typeof urls.onclick === 'string') {
		            	pullOnClick.apply(this);
		            }

		            if (urls.onvisible && typeof urls.onvisible === 'string') {
		            	pullOnVisible.apply(this);
		            }

		            if (urls.ontrigger && typeof urls.ontrigger === 'string') {
		            	pullOnTrigger.apply(this);
		            }

		        }
		    });
		},
		destroy: function () {

			return this.each(function(){

				var $this = $(this),
					data = $this.data('pixelPuller');

				$this.unbind('.pixelPuller');
				$(window).unbind('.pixelPuller');
				data.pixelPuller.remove();
				$this.removeData('pixelPuller');

			});
		}

	};

	$.fn.pixelPuller = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('jQuery.pixelPuller does\'nt have method ' +  method);
		}    
	};

	// private functions

	function pullPixel (url, callback) {
		var $this = $(this),
			data = $this.data('pixelPuller');

		// get pixel and if it's a link - replace window.location

		if (typeof callback === 'function') {
			$.ajax({
				url: url,
				type: 'xml',
				complete: callback
			});
		} else {
			$.ajax({
				url: url,
				type: 'xml'
			});
		}
	}

	function pullOnClick () {
		var $this = $(this),
			data = $this.data('pixelPuller'),
			args = [
				data.urls.onclick,
				function () {
					if (data.href && typeof data.href === 'string') {
						window.location = data.href;
					}
				}
			];

		$this.on('click.pixelPuller', function () {

			pullPixel.apply(this, args);

			if (!data.repetitions.onclick) {
				$this.off('click.pixelPuller');
			}
		});
	}

	function pullOnVisible () {
		var $this = $(this),
			data = $this.data('pixelPuller');

		pullVisibleBlockPixel.apply(this);

		$(window).on('resize.pixelPuller scroll.pixelPuller', function () {
			clearTimeout(data.debounceTimer);

			data.debounceTimer = setTimeout(pullVisibleBlockPixel.bind(this), data.debounceTime);
		}.bind(this));
	}

	function pullVisibleBlockPixel () {
		var $this = $(this),
			data = $this.data('pixelPuller'),
			args = [
				data.urls.onvisible,
				null
			];

		if (isElementVisible.apply(this)) {
			if (!data.isVisibleAndPixelPulled) {
				pullPixel.apply(this, args);
			}
			data.isVisibleAndPixelPulled = true;
		} else {
			// if it's repeatable
			if (data.repetitions.onvisible) {
				data.isVisibleAndPixelPulled = false;
			}
		}
	}

	function pullOnTrigger () {
		var $this = $(this),
			data = $this.data('pixelPuller'),
			args = [
				data.urls.ontrigger,
				null
			];

		$this.on('pullPixel.pixelPuller', function () {
			pullPixel.apply(this, args);

			if (!data.repetitions.ontrigger) {
				$this.off('pullPixel.pixelPuller');
			}
		}.bind(this));
	}

	function getRepetitions (str) {
		var params;

		if (str && typeof str === 'string') {
			params = str.trim().toLowerCase().match(/[^ ]+/g);
		} else {
			params = false;
		}

		return params;
	}

	function isElementVisible () {
		var $this = $(this),
			$window = $(window),
			elementTop = $this.offset().top,
			elementBottom = elementTop + $this.outerHeight(),
			viewportTop = $window.scrollTop(),
			viewportBottom = viewportTop + $window.height();

		return elementBottom > viewportTop && elementTop < viewportBottom;
	}

})(jQuery);