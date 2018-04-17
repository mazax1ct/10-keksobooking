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
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var photos = [
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
var createAds = function () {
  var ads = [];
  for (var i = 0; i < ADS_COUNT; i++) {
    var x = String(getRandomArbitary(300, 900));
    var y = String(getRandomArbitary(150, 500));
    var ad = {
      author: {
        avatar: 'img/avatars/user' + '0' + (i + 1).toFixed(0) + '.png'
      },
      offer: {
        title: offerTitles[i],
        address: x + ', ' + y,
        price: getRandomArbitary(1000, 1000000),
        type: offerTypes[getRandomArbitary(0, offerTypes.length)],
        rooms: getRandomArbitary(1, 5),
        guests: getRandomArbitary(1, 5),
        checkin: checkinCheckout[getRandomArbitary(0, checkinCheckout.length)],
        checkout: checkinCheckout[getRandomArbitary(0, checkinCheckout.length)],
        features: features.slice(getRandomArbitary(0, features.length)),
        description: '',
        photos: photos.sort(function () {
          return 0.5 - Math.random();
        })
      },
      location: {
        'x': x,
        'y': y
      }
    };
    ads.push(ad);
  }
  return ads;
};

// убираем затенение с карты
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// выбираем шаблон для точек
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
// определяем фрагмент для точки
var pinFragment = document.createDocumentFragment();

// рисуем точки на карте
var drawPins = function (ads) {
  for (var i = 0; i < ads.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = ads[i].location.x - pinElement.offsetWidth / 2 + 'px';
    pinElement.style.top = ads[i].location.y - pinElement.offsetHeight + 'px';
    pinElement.querySelector('img').src = ads[i].author.avatar;
    pinElement.querySelector('img').alt = ads[i].offer.title;
    pinFragment.appendChild(pinElement);
  }
  return pinFragment;
};

drawPins(createAds());

// определям блок для точек
var pinsList = document.querySelector('.map__pins');

// вставка фрагмента
pinsList.appendChild(pinFragment);

// выбираем шаблон для объявления
var adTemplate = document.querySelector('template').content.querySelector('.map__card');
// определяем фрагмент для точки
var adFragment = document.createDocumentFragment();

// рисуем карточку объявления на основе первого элемента из массива объявлений
var drawAd = function (ads) {
  var adElement = adTemplate.cloneNode(true);
  adElement.querySelector('.popup__title').textContent = ads[0].offer.title;
  adElement.querySelector('.popup__text--address').textContent = ads[0].offer.address;
  var typeTranslate = '';
  adElement.querySelector('.popup__text--price').textContent = ads[0].offer.price + '₽/ночь';
  // как мне кажется тут лучше воспользоваться перебором массива соответствий, но его нет
  if (ads[0].offer.type === 'flat') {
    typeTranslate = 'Квартира';
  } else if (ads[0].offer.type === 'bungalo') {
    typeTranslate = 'Бунгало';
  } else if (ads[0].offer.type === 'house') {
    typeTranslate = 'Дом';
  } else if (ads[0].offer.type === 'palace') {
    typeTranslate = 'Дворец';
  }
  adElement.querySelector('.popup__type').textContent = typeTranslate;
  adElement.querySelector('.popup__text--capacity').textContent = ads[0].offer.rooms + ' комнаты для ' + ads[0].offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ads[0].offer.checkin + ', выезд до ' + ads[0].offer.checkout;
  var featuresList = adElement.querySelector('.popup__features');
  featuresList.innerHTML = '';
  for (var i = 0; i < ads[0].offer.features.length; i++) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature', 'popup__feature--' + ads[0].offer.features[i]);
    featuresList.appendChild(feature);
  }
  adElement.querySelector('.popup__description').textContent = ads[0].offer.description;
  var photoFragment = document.createDocumentFragment();
  for (var j = 0; j < ads[0].offer.photos.length; j++) {
    var photo = document.querySelector('template').content.querySelector('.popup__photo').cloneNode(true);
    photo.src = ads[0].offer.photos[j];
    photoFragment.appendChild(photo);
  }
  adElement.querySelector('.popup__photos').innerHTML = '';
  adElement.querySelector('.popup__photos').appendChild(photoFragment);
  adElement.querySelector('.popup__avatar').src = ads[0].author.avatar;

  adFragment.appendChild(adElement);

  return adFragment;
};

drawAd(createAds(0));

// определям блок для точек
var adPlace = document.querySelector('.map');

// вставка фрагмента
adPlace.insertBefore(adFragment, adPlace.querySelector('.map__filters-container'));
