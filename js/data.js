'use strict';
(function () {
  // мокинг
  var OFFER_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var OFFER_TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var CHECKIN_CHECKOUT = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var ADS_COUNT = 8;

  // функция создание массива объявлений
  var makeAdsArray = function () {
    var adsArray = [];
    for (var i = 0; i < ADS_COUNT; i++) {
      var x = String(window.util.getRandomArbitary(300, 900));
      var y = String(window.util.getRandomArbitary(150, 500));
      var ad = {
        author: {
          avatar: 'img/avatars/user' + '0' + (i + 1).toFixed(0) + '.png'
        },
        offer: {
          title: OFFER_TITLES[i],
          address: x + ', ' + y,
          price: window.util.getRandomArbitary(1000, 1000000),
          type: OFFER_TYPES[window.util.getRandomArbitary(0, OFFER_TYPES.length)],
          rooms: window.util.getRandomArbitary(1, 5),
          guests: window.util.getRandomArbitary(1, 5),
          checkin: CHECKIN_CHECKOUT[window.util.getRandomArbitary(0, CHECKIN_CHECKOUT.length)],
          checkout: CHECKIN_CHECKOUT[window.util.getRandomArbitary(0, CHECKIN_CHECKOUT.length)],
          features: FEATURES.slice(window.util.getRandomArbitary(0, FEATURES.length)),
          description: '',
          photos: PHOTOS.sort(function () {
            return 0.5 - Math.random();
          })
        },
        location: {
          x: x,
          y: y
        }
      };
      adsArray.push(ad);
    }
    return adsArray;
  };
  // записываем результат в переменную и экспортируем в глобальную область видимости
  window.data = makeAdsArray();
})();
