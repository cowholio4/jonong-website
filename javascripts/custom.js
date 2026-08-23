var cbpAnimatedHeader = (function() {
  if (location.pathname != '/') {
    return
  }
  var docElem = document.documentElement,
      header = document.querySelector('.cbp-af-header'),
      didScroll = false,
      changeHeaderOn = 300;
  function init() {
    scrollPage();
    window.addEventListener( 'scroll', function( event ) {
      if( !didScroll ) {
        didScroll = true;
        setTimeout( scrollPage, 200 );
      }
    }, false );
  }
  function scrollPage() {
    var sy = scrollY();
    if (header) {
      header.classList.toggle('cbp-af-header-shrink', sy >= changeHeaderOn);
    }
    didScroll = false;
  }
  function scrollY() {
    return window.pageYOffset || docElem.scrollTop;
  }
  init();
})();

/* GA Lite */
galite('create', 'UA-33448710-3', 'auto');
galite('send', 'pageview');
window.addEventListener(
  'unload',
  function () { galite('send', 'timing', 'JS Dependencies', 'unload') }
)
