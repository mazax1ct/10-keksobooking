'use strict';
(function () {
  // введем ограничения на возможные координаты основной точки
  var TOP_STOP = 150;
  var BOTTOM_STOP = 500;

  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var formFieldset = document.querySelectorAll('.map__filter, .map__features, .ad-form__element'); // ищем не активные элементы форм
  var addressInput = document.querySelector('#address');
  var mapPins;

  // функция обработчика клика по точке объявления на карте
  var mapPinClickHandler = function (evt) {
    // открываем необходимый попап
    window.popup.open(evt);
  };

  // функция обработчика нажатия enter по точке объявления на карте
  var mapPinKeyDownHandler = function (evt) {
    window.util.isEnterEvent(evt, window.popup.open);
  };

  window.pin = function (element) {
    // навешиваем обработчик на нажите мыши
    element.addEventListener('mousedown', function (evt) {
      // отменяем события по умолчанию
      evt.preventDefault();

      // если карта не активна
      if (map.classList.contains('map--faded')) {
        // активируем карту
        window.map.init();

        // активируем форму под картой и фильтр
        window.form.init(adForm, formFieldset);

        // получаем адрес
        var address = window.map.address(element);
        addressInput.value = String(address);

        // определям блок для точек
        var pinsList = document.querySelector('.map__pins');

        // отрисовка точек на карте
        var pins = window.pins.draw(window.data);
        pinsList.appendChild(pins);

        // ловим отрисованные точки и регистрируем им обработчики
        mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
        mapPins.forEach(function (pin) {
          pin.addEventListener('mouseup', mapPinClickHandler);
          pin.addEventListener('keydown', mapPinKeyDownHandler);
        });
      }

      // пишем начальные координаты в переменную
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      // обработчик перемещения мыши
      var onMouseMove = function (moveEvt) {
        // отменяем события по умолчанию
        moveEvt.preventDefault();

        // считаем разницу между начальными координатами и точкой куда переместили блок
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        // перезаписываем начальные координаты
        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        // переопределяем переменные для удобства
        var pinYCoord = element.offsetTop - shift.y;
        var pinXCoord = element.offsetLeft - shift.x;

        // считаем высоту пина с учетом псевдоэлемента
        var elementHeight = parseInt(getComputedStyle(element).height, 10) + parseInt(getComputedStyle(element, ':after').height, 10);

        // проверяем выходит ли пин за ограничения
        if (pinYCoord < TOP_STOP - elementHeight) {
          pinYCoord = TOP_STOP - elementHeight;
        }

        if (pinYCoord > BOTTOM_STOP - elementHeight) {
          pinYCoord = BOTTOM_STOP - elementHeight;
        }

        if (pinXCoord < 0) {
          pinXCoord = 0;
        }

        // в случае с правой стороной из ширины карты вычитаем еще и ширину самого пина
        if (pinXCoord > map.offsetWidth - element.offsetWidth) {
          pinXCoord = map.offsetWidth - element.offsetWidth;
        }

        // устанавливаем стили
        element.style.top = pinYCoord + 'px';
        element.style.left = pinXCoord + 'px';

        // переопределяем адресс
        address = window.map.address(element);
        addressInput.value = String(address);
      };

      // обработчик "отжатия" мыши
      var onMouseUp = function (upEvt) {
        // отменяем события по умолчанию
        upEvt.preventDefault();

        // переопределяем адресс
        address = window.map.address(element);
        addressInput.value = String(address);

        // удаляем обработчики событий с блока
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      // подписываемся на события нажития мыши и "отжатия" мыши на окне
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };
})();
