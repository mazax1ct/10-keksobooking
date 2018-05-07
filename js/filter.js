'use strict';
(function () {
  var filter = document.querySelector('.map__filters'); // блок фильтра
  window.filter = {
    // функция сброса фильтра
    reset: function () {
      filter.reset();
    }
  };
})();
