'use strict';

// мокинг
var offerTitles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var offerTypes = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var checkinCheckout = [
  '12:00',
  '13:00',
  '14:00'
];

var features = [
  'wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'
];

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var ADSCOUNT = 8;
// рандом в заданном диапазоне
var getRandomArbitary = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// создание массива объявлений
var createAds = function (adsCount) {
  var ads = [];
  for (var i = 0; i < adsCount; i++) {
    var ad = {
      author: {
        avatar: 'img/avatars/user' + '0' + (i + 1).toFixed(0) + '.png'
      },
      offer: {
        title: offerTitles[i],
        address: '{{location.x}}, {{location.y}}',
        price: getRandomArbitary(1000, 1000000),
        type: offerTypes[getRandomArbitary(0, offerTypes.length)],
        rooms: getRandomArbitary(1, 5),
        guests: getRandomArbitary(1, 5),
        checkin: checkinCheckout[getRandomArbitary(0, checkinCheckout.length)],
        checkout: checkinCheckout[getRandomArbitary(0, checkinCheckout.length)],
        features: function () {
          var result = [];
          for (var j = 0; j < getRandomArbitary(0, features.length); j++) {
            result.push(features[j]);
          }
          return result;
        },
        description: '',
        photos: function () {
          return photos.sort(Math.random() - 0.5);
        }
      },
      location: {
        'x': getRandomArbitary(300, 900),
        'y': getRandomArbitary(150, 500)
      }
    };
    ads.push(ad);
  }
  return ads;
};

var ads = createAds(ADSCOUNT);

console.log(ads);

var map = document.querySelector('.map');

map.classList.remove('map--faded');

// var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

// var fragment = document.createDocumentFragment();

/* var drawPins = function (adsList) {
  for (var i = 0; i < wizards.length; i++) {
    var wizardElement = wizardTemplate.cloneNode(true);
    wizardElement.querySelector('.setup-similar-label').textContent = wizard[i].name + ' ' + wizard[i].surname;
    wizardElement.querySelector('.wizard-coat').style.fill = wizard[i].coat;
    wizardElement.querySelector('.wizard-eyes').style.fill = wizard[i].eyes;
    fragment.appendChild(wizardElement);
  }
  return fragment;
};

drawPins(ads);*/
