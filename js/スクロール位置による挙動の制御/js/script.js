$('#pageTop').hide();
$(window).scroll(function () {
  if ($(this).scrollTop() > 250) {
    $('#pageTop').fadeIn();
  } else {
    $('#pageTop').fadeOut();
  }
});
$('#pageTop').click(function () {
    var toTopTarget = $('body').offset().top;
    $('body, html').animate({
      scrollTop: toTopTarget
    }, 500, 'swing');
    return false;
  });
