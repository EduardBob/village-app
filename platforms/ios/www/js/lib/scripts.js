$( document ).ready(function() {

  // height of the wrapper

  // var H = $(window).height() - 20; // for IOS
  var H = $(window).height(); // for android
  $('.wrapper').height(H);
  $('.main-container').css('min-height', H);
});