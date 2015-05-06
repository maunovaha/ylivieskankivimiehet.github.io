// Scrolling to proper sections of the page
$(function() {
  $('body').on('click', '.navbar-link', function(event) {
    var $that = $(this);

    $('html, body').stop().animate({
      scrollTop: $($that.attr('href')).offset().top
    }, 1500, 'easeInOutExpo');

    event.preventDefault();
  });
});