'use strict';
(function () {
  var map = document.querySelector('.map'); // блок карты

  window.map = {
    init: function () {
      // убираем затенение с карты
      map.classList.remove('map--faded');
    },
    // сброс карты в исходное состояние
    reset: function () {
      // убираем затенение с карты
      map.classList.add('map--faded');
    }
  };
})();
