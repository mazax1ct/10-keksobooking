'use strict';
(function () {
  // введем ограничения на возможные координаты основной точки
  var TOP_STOP = 150;
  var BOTTOM_STOP = 500;
  // значения координат главной точки по умолчанию, для функции сброса главной точки
  var DEFAULT_X = '375px';
  var DEFAULT_Y = '570px';
  // количество пинов для отрисовки
  var PINS_AMOUNT = 5;

  window.constants = {
    pinTopStop: TOP_STOP,
    pinBottomStop: BOTTOM_STOP,
    pinDefaultX: DEFAULT_X,
    pinDefaultY: DEFAULT_Y,
    pinsAmount: PINS_AMOUNT
  };
})();
