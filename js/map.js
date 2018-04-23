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

var ENTER_CODE = 13;

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

// выбираем шаблон для точек
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

// функция отрисовки точек на карте
var drawPins = function (adsArray) {
  var pinFragment = document.createDocumentFragment();
  adsArray.forEach(function (ad, i) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.setAttribute('data-target', 'popup_' + i);
    pinElement.style.left = ad.location.x - pinElement.offsetWidth / 2 + 'px';
    pinElement.style.top = ad.location.y - pinElement.offsetHeight + 'px';
    pinElement.querySelector('img').src = ad.author.avatar;
    pinElement.querySelector('img').alt = ad.offer.title;
    pinFragment.appendChild(pinElement);
  });
  return pinFragment;
};

// определям блок для точек
var pinsList = document.querySelector('.map__pins');

// выбираем шаблон для объявления
var adTemplate = document.querySelector('template').content.querySelector('.map__card');

// функция отрисовки карточки объявления из массива объявлений
var drawAd = function (adsArray) {
  var adFragment = document.createDocumentFragment();
  adsArray.forEach(function (ad, i) {
    var adElement = adTemplate.cloneNode(true);
    adElement.classList.add('hidden');
    adElement.setAttribute('id', 'popup_' + i);
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
  });
  return adFragment;
};

// ищем не активные элементы форм
var formFieldset = document.querySelectorAll('.map__filter, .map__features, .ad-form__element');

// функция активации формы под картой
var setFormActive = function (elements) {
  elements.forEach(function (element) {
    element.removeAttribute('disabled');
  });
};

// ищем блоки главной точки, карты, формы объявления
var map = document.querySelector('.map');
var mainPin = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var addressInput = document.querySelector('#address');
var mapPins;
var popups;

// функция получения начального адреса (середина точки)
var getStartAddress = function (element) {
  var xCenter = element.offsetWidth / 2;
  var yCenter = element.offsetHeight / 2;
  var x = String(element.offsetLeft - xCenter);
  var y = String(element.offsetTop - yCenter);
  return x + ', ' + y;
};

// устанавливаем адрес при загрузке страницы
var startAddress = getStartAddress(mainPin);
addressInput.value = String(startAddress);

// функция получения адреса при перетаскивании точки (середина нижнего края блока с меткой)
// пока получаем просто точку клика мыши на кнопку относительно окна браузера, потом нужно переписать чтобы отсчет велся относительно блока карты
var getAddress = function (element) {
  var x = element.clientX;
  var y = element.clientY;
  return x + ', ' + y;
};

// функция обработчика первого касания главной точки на карте
var mainPinFirstClickHandler = function (evt) {
  // снимаем атрибут disabled
  setFormActive(formFieldset);

  // убираем затенение с карты
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  // передаем event в функцию расчета местополоения точки и возвращаем координаты для поля адрес
  var address = getAddress(evt);
  addressInput.value = String(address);

  // отрисовка точек на карте
  var pins = drawPins(ads);
  pinsList.appendChild(pins);

  // ловим отрисованные точки и регистрируем им обработчики
  mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  mapPins.forEach(function (pin) {
    pin.addEventListener('mouseup', mapPinClickHandler);
    pin.addEventListener('keydown', mapPinKeyDownHandler);
  });

  // отрисовка попапов объявлений
  var adPopups = drawAd(ads);
  map.insertBefore(adPopups, map.querySelector('.map__filters-container'));

  // ловим отрисованные попапы и регистрируем их кнопкам закрытия обработчики
  popups = document.querySelectorAll('.map__card');
  popups.forEach(function (popup) {
    var popupCloser = popup.querySelector('.popup__close');
    popupCloser.addEventListener('mouseup', popupCloseClickHandler);
    popupCloser.addEventListener('keydown', popupCloseEnterHandler);
  });
  // удаляем обработчик первого клика
  mainPin.removeEventListener('mouseup', mainPinFirstClickHandler);
};

// добавляем обработчик первого касания главной точки на карте
mainPin.addEventListener('mouseup', mainPinFirstClickHandler);

// обработчик перетаскивания главной точки на карте
var mainPinDragHandler = function (evt) {
  // передаем event в функцию расчета местополоения точки и возвращаем координаты для поля адрес
  var address = getAddress(evt);
  addressInput.value = String(address);
};

// добавляем обработчик перетаскивания главной точки на карте
mainPin.addEventListener('mouseup', mainPinDragHandler);

// функция закрытия попапа
var closePopup = function () {
  // ищем открытый попап и если он есть, тоглим классы
  var openedPopup = map.querySelector('.map__card.opened');
  if (openedPopup !== null) {
    openedPopup.classList.add('hidden');
    openedPopup.classList.remove('opened');
  }
};

// функция открытия попапа
var openPopup = function (item) {
  var target = item.target.attributes.getNamedItem('data-target').value;
  var currentPopup = map.querySelector('#' + target);
  currentPopup.classList.remove('hidden');
  currentPopup.classList.add('opened');
};

// функция обработчика клика по точке объявления на карте
var mapPinClickHandler = function (evt) {
  // закрываем открытый попап
  closePopup();
  // открываем необходимый попап
  openPopup(evt);
};

// функция обработчика нажатия enter по точке объявления на карте
var mapPinKeyDownHandler = function (evt) {
  if (evt.keyCode === ENTER_CODE) {
    // закрываем открытый попап
    closePopup();
    // открываем необходимый попап
    openPopup(evt);
  }
};

// функция обработчика клика по кнопке закрытия попапа
var popupCloseClickHandler = function () {
  closePopup();
};

// функция обработчика нажатия enter по кнопке закрытия попапа
var popupCloseEnterHandler = function (evt) {
  if (evt.keyCode === ENTER_CODE) {
    closePopup();
  }
};
