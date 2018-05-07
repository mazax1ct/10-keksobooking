'use strict';
(function () {
  var map = document.querySelector('.map'); // блок карты
  var mainPin = document.querySelector('.map__pin--main'); // блок главного пина
  var addressInput = document.querySelector('#address'); // инпут адреса

  // функция активации страницы
  var pageActivate = function () {
    // если карта не активна
    if (map.classList.contains('map--faded')) {
      // активируем карту
      window.map.init();

      // активируем форму под картой и фильтр
      window.form.init();

      // получаем и устанавливаем адрес
      window.pin.address();

      // отрисовка точек на карте после загрузки данных
      var onLoad = function (data) {
        // сразу экспортируем данные в глобальную область видимости, для отрисовки попапа
        window.ads = data;
        // вставляем
        window.pins.draw(data, window.constants.pinsAmount);
      };

      // функция загрузки с коллбеком
      window.backend.download(onLoad, window.backend.error);
    }
  };

  // функция обработчика перетаскивания главной точки
  var mainPinDragHandler = function (evt) {
    // отменяем события по умолчанию
    evt.preventDefault();

    // активируем страницу
    pageActivate();

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
      var pinYCoord = mainPin.offsetTop - shift.y;
      var pinXCoord = mainPin.offsetLeft - shift.x;

      // считаем высоту пина с учетом псевдоэлемента
      var elementHeight = parseInt(getComputedStyle(mainPin).height, 10) + parseInt(getComputedStyle(mainPin, ':after').height, 10);

      // проверяем выходит ли пин за ограничения
      if (pinYCoord < window.constants.pinTopStop - elementHeight) {
        pinYCoord = window.constants.pinTopStop - elementHeight;
      }

      if (pinYCoord > window.constants.pinBottomStop - elementHeight) {
        pinYCoord = window.constants.pinBottomStop - elementHeight;
      }

      if (pinXCoord < 0) {
        pinXCoord = 0;
      }

      // в случае с правой стороной из ширины карты вычитаем еще и ширину самого пина
      if (pinXCoord > map.offsetWidth - mainPin.offsetWidth) {
        pinXCoord = map.offsetWidth - mainPin.offsetWidth;
      }

      // устанавливаем стили
      mainPin.style.top = pinYCoord + 'px';
      mainPin.style.left = pinXCoord + 'px';

      // переопределяем адресс
      window.pin.address();
    };

    // обработчик "отжатия" мыши
    var onMouseUp = function (upEvt) {
      // отменяем события по умолчанию
      upEvt.preventDefault();

      // переопределяем адресс
      window.pin.address();

      // удаляем обработчики событий с блока
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // подписываемся на события нажития мыши и "отжатия" мыши на окне
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // функция обработчика нажатия кнопки на главный пин
  var mainPinKeyDownHandler = function (evt) {
    // отменяем события по умолчанию
    evt.preventDefault();

    // активируем страницу
    pageActivate();

    // удаляем обработчик
    mainPin.removeEventListener('keydown', mainPinKeyDownHandler);
  };

  // навешиваем обработчик на нажите мыши
  mainPin.addEventListener('mousedown', mainPinDragHandler);

  // навешиваем обработчик на нажите кнопки
  mainPin.addEventListener('keydown', mainPinKeyDownHandler);

  window.pin = {
    address: function () {
      var leftOffset = parseInt(mainPin.style.left, 10);
      var topOffset = parseInt(mainPin.style.top, 10);
      var height;
      // разный рассчет высоты главного пина в зависимости от состояния карты
      if (map.classList.contains('map--faded')) {
        height = Math.floor(parseInt(getComputedStyle(mainPin).height, 10) / 2);
      } else {
        height = parseInt(getComputedStyle(mainPin).height, 10) + parseInt(getComputedStyle(mainPin, ':after').height, 10);
      }
      var halfWidth = Math.floor(parseInt(getComputedStyle(mainPin).width, 10) / 2);
      var x = leftOffset + halfWidth;
      var y = topOffset + height;
      var addressString = x + ', ' + y;
      addressInput.value = addressString;
    },
    reset: function () {
      mainPin.style.top = window.constants.pinDefaultX;
      mainPin.style.left = window.constants.pinDefaultY;
      window.pin.address();
    }
  };

  // устанавливаем адрес при загрузке страницы
  window.pin.address();
})();
