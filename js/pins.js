'use strict';
(function () {
  // выбираем шаблон для точек
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  // функция отрисовки точек на карте
  window.pins = {
    draw: function (adsArray) {
      var pinFragment = document.createDocumentFragment();
      adsArray.forEach(function (ad, i) {
        var pinElement = pinTemplate.cloneNode(true);
        pinElement.setAttribute('data-target', i);
        pinElement.style.left = ad.location.x - pinElement.offsetWidth / 2 + 'px';
        pinElement.style.top = ad.location.y - pinElement.offsetHeight + 'px';
        pinElement.querySelector('img').src = ad.author.avatar;
        pinElement.querySelector('img').alt = ad.offer.title;
        pinFragment.appendChild(pinElement);
      });
      return pinFragment;
    }
  };
})();
