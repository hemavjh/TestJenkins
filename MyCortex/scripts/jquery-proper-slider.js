(function($) {

	 var
	 	 methods = {
		     init : function(options) {

		         var settings = $.extend({
		            	width: 300,
		            	height: 300,
						auto_slide: false,
						auto_slide_delay : 6000
		        	}, options);

		        return this.each(function() {

		            var slides = $(this),
		            	ul = slides.find('ul'),
		            	li = ul.find('li'),
		            	count = li.length + 2;

					settings.auto_slide_timeout_id = null;

		            slides.data('settings', settings);

		            slides.css({
		            	width : settings.width + 'px',
		            	height : settings.height + 'px'
		            });

		            ul.css({
		            	width : count * settings.width + 'px',
		            	height : settings.height + 'px'
		            });

		            li.css({
		            	width : settings.width + 'px',
		            	height : settings.height + 'px'
		            });

		            li.filter(':first').addClass('first');
		            li.filter(':last').addClass('last');

		            li
		            	.filter('.first')
		            	.clone()
		            	.removeClass('first')
		            	.addClass('first_clone')
		            	.addClass('clone')
		            	.insertAfter(li.filter('.last'));

		            li
		            	.filter('.last')
		            	.clone()
		            	.removeClass('last')
		            	.addClass('last_clone')
		            	.addClass('clone')
		            	.insertBefore(li.filter('.first'));

		            slides.properSlider('show', 1);

					if(settings.auto_slide) {
						settings.auto_slide_interval_id = setInterval(function() {
							slides.properSlider('slide', 'next');
						}, settings.auto_slide_delay);
					}

		        });

		     },

		     show : function(n) {

		    	 return this.each(function() {

		            var slides = $(this),
		            	ul = slides.find('ul'),
		            	settings = slides.data('settings');

		            ul.css({
		            	left : -1 * n * settings.width + 'px'
		            });

		        });
	    	 },

		     slide : function(direction) {

		    	 direction = (direction == "next") ? 1 : (direction == 'prev' ? -1 : 0);

		    	 return this.each(function() {

		    		 var slides = $(this),
		    		 	 ul = slides.find('ul'),
		    		 	 li = ul.find('li'),
		    		 	 settings = slides.data('settings'),
		    		 	 current,
		    		 	 count = li.length;

		    		 ul.stop(true, true);

		    		 current = Math.round(Math.abs(parseInt(ul.css('left'), 10))/settings.width);

		    		 current += direction;

	    			 if(current == count - 1) {
	    				 ul
	    				 	.stop(true, true)
	    				 	.animate({
	    				 		left : 0
	    				 	}, 1);
	    				 current = 1;
	    			 } else if (current == 0) {
	    				 ul
	    				 	.stop(true, true)
	    				 	.animate({
	    				 		left : -1 * (count - 1) * settings.width
	    				 	}, 1);
	    				 current = count - 2;
	    			 }

		    		 ul
			    		 .animate({
			    			 left : -1 * current * settings.width
			    		 });
		    	 });
		     }
	 	 };

    $.fn.properSlider = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[methodOrOptions].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.properSlider' );
        }
    };

}(jQuery));
