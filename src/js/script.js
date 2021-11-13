jQuery(function($) {

  // ハンバーガーメニュー
  $('.js-burger-btn').click(function() {
    $('.js-burger-btn').toggleClass('is-open');
    $('.js-burger-menu').toggleClass('is-open');
    $('html, body').toggleClass('is-fixed');

    // スクロール禁止（iOSでは追加設定が必要）
    if ($('html').hasClass('is-fixed')) {
      $(window).on('touchmove.noScroll', function(e) {
        e.preventDefault();
      });
    } else {
      $(window).off('.noScroll');
    }
  });
});