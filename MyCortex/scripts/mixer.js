$(function() {
	var slides1 = $('#slides1'),
		slides2 = $('#slides2');

	//Example 1
	slides1.properSlider({
		width : 300,
		height : 120,
			auto_slide: true
	});

	$('#next').click(function() {
		slides1.properSlider('slide', 'next');
		return false;
	});

	$('#prev').click(function() {
		slides1.properSlider('slide', 'prev');
		return false;
	});

 
});
