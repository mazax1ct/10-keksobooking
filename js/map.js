'use strict';
(function () {
  // ищем блоки главной точки, карты, формы объявления
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var formFieldset = document.querySelectorAll('.map__filter, .map__features, .ad-form__element'); // ищем не активные элементы форм
  var addressInput = document.querySelector('#address');

  window.map = {
    init: function () {
      // убираем затенение с карты
      map.classList.remove('map--faded');
    },
    // сброс карты в исходное состояние
    reset: function () {
      // убираем затенение с карты
      map.classList.add('map--faded');
      // возвращаем главный пин в исходное положение
      mainPin.style.top = '375px';
      mainPin.style.left = '570px';
      // сбрасываем форму
      window.form.reset(adForm, formFieldset);
    },
    // функция получения начального адреса (середина точки)
    address: function (element) {
      var leftOffset = parseInt(element.style.left, 10);
      var topOffset = parseInt(element.style.top, 10);
      var height;
      // разный рассчет высоты главного пина в зависимости от состояния карты
      if (map.classList.contains('map--faded')) {
        height = Math.floor(parseInt(getComputedStyle(element).height, 10) / 2);
      } else {
        height = parseInt(getComputedStyle(element).height, 10) + parseInt(getComputedStyle(element, ':after').height, 10);
      }
      var halfWidth = Math.floor(parseInt(getComputedStyle(element).width, 10) / 2);
      var x = leftOffset + halfWidth;
      var y = topOffset + height;
      return x + ', ' + y;
    }
  };

  // устанавливаем адрес при загрузке страницы
  var startAddress = window.map.address(mainPin);
  addressInput.value = String(startAddress);

  // драг/дроп диалога
  window.pin(mainPin);
})();
