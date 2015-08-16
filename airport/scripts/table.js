$(document).ready( function() {

	/*fixed header*/
	$('table').addClass('main');
	var table = $('table').clone(true);

	$(table).addClass('fixed');
	$('body').append(table);

	$('.fixed').find('tbody').html('');
	console.log($('body').find('table'));
	var copy_col =$('.fixed tr').children();
    var table_col = $('.main tr').children();
	for (var i = 0; i < copy_col.length; i++) {
        $(copy_col[i]).width($(table_col[i]).width());
    }
	$('.fixed').css('top', -1 * $('.fixed').height());

	$(window).bind('scroll', function () {
		if ($(window).scrollTop() > 33) {
			$('.fixed').css('opacity', 1);
	    	$('.fixed').css('top', $(window).scrollTop() - $('.main').height() - 33);
	    } else {
	    	$('.fixed').css('opacity', 0);
	    } 
	});

	/*column change color*/
	$('td').mouseover( function() {
	    $(this).parent().parent().find('td').filter(':nth-child(' + ($(this).index()+1) + ')').css('background', '#F4A460');
	  });

	$('td').mouseout(function() {
		$(this).parent().parent().find('td').filter(':nth-child(' + ($(this).index()+1) + ')').css('background', 'transparent');
	});

	/*only one type - arrival or departure*/
	$('#arrival').click( function() {
		$('.in').removeClass('invisible');
		$('.out').addClass('invisible');                             
	});

	$("#departure").click( function() {  
		$('.out').removeClass('invisible');
		$('.in').addClass('invisible');
	});

	/*new window with all information*/
	$('tbody tr').click( function(){
		var allInfo = window.open("", 'Info' + $(this).find('td').filter(":nth-child(10)").html(), "width=800, height=100, top=100, left=100");
		allInfo.document.write($(this).html());
	});

});