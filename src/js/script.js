jQuery(function($) {

  // 変数定義
  const pageTop = $('.js-page-top');

  // 初期化
  pageTop.hide();

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

  // スムーススクロール
  $('a').click(function() {
    let target = $(this).attr('href');

    if (!target.startsWith('#')) {
      return true;
    }

    let position = $(target).offset().top;
    $('body, html').animate({ scrollTop: position }, 300);
    return false;
  });

  // ページトップボタン
  pageTop.click(function() {
    $('body, html').animate({ scrollTop: 0 }, 300);
    return false;
  });

  // スクロール位置による表示の切り替え
  $(window).scroll(function() {
    if ($(this).scrollTop() > $('.js-first-view').height()) {
      pageTop.fadeIn();
    } else {
      pageTop.fadeOut();
    }
  });
});