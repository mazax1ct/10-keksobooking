'use strict';
(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin'); // выбираем шаблон для точек
  var pinsList = document.querySelector('.map__pins'); // определям блок для точек

  // функция обработчика клика по точке объявления на карте
  var mapPinClickHandler = function (evt) {
    // открываем необходимый попап
    window.popup.open(evt);
  };

  // функция обработчика нажатия enter по точке объявления на карте
  var mapPinKeyDownHandler = function (evt) {
    window.util.isEnterEvent(evt, window.popup.open);
  };

  window.pins = {
    // функция отрисовки точек на карте
    draw: function (data, count) {
      // создаем фрагмент
      var pinFragment = document.createDocumentFragment();
      // обрезаем полученные данные до нужного количества
      var slicedData = data.slice(0, count);
      // перебираем массив с данными и формируем пины
      slicedData.forEach(function (ad, i) {
        var pinElement = pinTemplate.cloneNode(true);
        pinElement.setAttribute('data-target', i);
        pinElement.style.left = ad.location.x - pinElement.offsetWidth / 2 + 'px';
        pinElement.style.top = ad.location.y - pinElement.offsetHeight + 'px';
        pinElement.querySelector('img').src = ad.author.avatar;
        pinElement.querySelector('img').alt = ad.offer.title;
        pinFragment.appendChild(pinElement);
      });
      // вставляем точки в разметку
      pinsList.append(pinFragment);
      // ловим отрисованные точки и регистрируем им обработчики
      var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
      mapPins.forEach(function (pin) {
        pin.addEventListener('mouseup', mapPinClickHandler);
        pin.addEventListener('keydown', mapPinKeyDownHandler);
      });
    },
    // функция удаления точек
    remove: function () {
      // ловим отрисованные точки
      var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
      mapPins.forEach(function (pin) {
        // удаляем
        pin.remove();
      });
    }
  };
})();
