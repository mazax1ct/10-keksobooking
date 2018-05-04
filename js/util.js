'use strict';
(function () {
  // константы кодов кнопок для событий
  var ENTER_CODE = 13;
  var ESC_CODE = 27;
  window.util = {
    // функция рандома
    getRandomArbitary: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    // проверка нажатия Esc
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_CODE) {
        action();
      }
    },
    // проверка нажатия Enter
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_CODE) {
        action(evt);
      }
    }
  };
})();
