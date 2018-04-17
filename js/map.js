'use strict';
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

// рандом в заданном диапазоне
var getRandomArbitary = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// создание массива объявлений
var makeAdsArray = function () {
  var adsArray = [];
  for (var i = 0; i < ADS_COUNT; i++) {
    var x = String(getRandomArbitary(300, 900));
    var y = String(getRandomArbitary(150, 500));
    var ad = {
      author: {
        avatar: 'img/avatars/user' + '0' + (i + 1).toFixed(0) + '.png'
      },
      offer: {
        title: OFFER_TITLES[i],
        address: x + ', ' + y,
        price: getRandomArbitary(1000, 1000000),
        type: OFFER_TYPES[getRandomArbitary(0, OFFER_TYPES.length)],
        rooms: getRandomArbitary(1, 5),
        guests: getRandomArbitary(1, 5),
        checkin: CHECKIN_CHECKOUT[getRandomArbitary(0, CHECKIN_CHECKOUT.length)],
        checkout: CHECKIN_CHECKOUT[getRandomArbitary(0, CHECKIN_CHECKOUT.length)],
        features: FEATURES.slice(getRandomArbitary(0, FEATURES.length)),
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

var ads = makeAdsArray();

// убираем затенение с карты
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// выбираем шаблон для точек
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

// функция отрисовки точек на карте
var drawPins = function (adsArray) {
  var pinFragment = document.createDocumentFragment();
  adsArray.forEach(function (ad) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = ad.location.x - pinElement.offsetWidth / 2 + 'px';
    pinElement.style.top = ad.location.y - pinElement.offsetHeight + 'px';
    pinElement.querySelector('img').src = ad.author.avatar;
    pinElement.querySelector('img').alt = ad.offer.title;
    pinFragment.appendChild(pinElement);
  });
  return pinFragment;
};

var pins = drawPins(ads);

// определям блок для точек
var pinsList = document.querySelector('.map__pins');

// вставка фрагмента
pinsList.appendChild(pins);

// выбираем шаблон для объявления
var adTemplate = document.querySelector('template').content.querySelector('.map__card');
// определяем фрагмент для точки
var adFragment = document.createDocumentFragment();

// рисуем карточку объявления на основе первого элемента из массива объявлений
var drawAd = function (ad) {
  var adElement = adTemplate.cloneNode(true);
  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  var typeTranslate = '';
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  // как мне кажется тут лучше воспользоваться перебором массива соответствий, но его нет
  if (ad.offer.type === 'flat') {
    typeTranslate = 'Квартира';
  } else if (ad.offer.type === 'bungalo') {
    typeTranslate = 'Бунгало';
  } else if (ad.offer.type === 'house') {
    typeTranslate = 'Дом';
  } else if (ad.offer.type === 'palace') {
    typeTranslate = 'Дворец';
  }
  adElement.querySelector('.popup__type').textContent = typeTranslate;
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  var featuresList = adElement.querySelector('.popup__features');
  featuresList.innerHTML = '';
  ad.offer.features.forEach(function (feature) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('popup__feature', 'popup__feature--' + feature);
    featuresList.appendChild(featureElement);
  });
  adElement.querySelector('.popup__description').textContent = ad.offer.description;
  var photoFragment = document.createDocumentFragment();
  ad.offer.photos.forEach(function (photo) {
    var photoElement = document.querySelector('template').content.querySelector('.popup__photo').cloneNode(true);
    photoElement.src = photo;
    photoFragment.appendChild(photoElement);
  });
  adElement.querySelector('.popup__photos').innerHTML = '';
  adElement.querySelector('.popup__photos').appendChild(photoFragment);
  adElement.querySelector('.popup__avatar').src = ad.author.avatar;

  adFragment.appendChild(adElement);

  return adFragment;
};

drawAd(ads[0]);

// определям блок для точек
var adPlace = document.querySelector('.map');

// вставка фрагмента
adPlace.insertBefore(adFragment, adPlace.querySelector('.map__filters-container'));
