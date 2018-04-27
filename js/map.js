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
    pinElement.setAttribute('data-target', i);
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
var drawAd = function (adsArray, i) {
  var adFragment = document.createDocumentFragment();
  var adElement = adTemplate.cloneNode(true);
  adElement.querySelector('.popup__title').textContent = adsArray[i].offer.title;
  adElement.querySelector('.popup__text--address').textContent = adsArray[i].offer.address;
  var typeTranslate = '';
  adElement.querySelector('.popup__text--price').textContent = adsArray[i].offer.price + '₽/ночь';
  // как мне кажется тут лучше воспользоваться перебором массива соответствий, но его нет
  if (adsArray[i].offer.type === 'flat') {
    typeTranslate = 'Квартира';
  } else if (adsArray[i].offer.type === 'bungalo') {
    typeTranslate = 'Бунгало';
  } else if (adsArray[i].offer.type === 'house') {
    typeTranslate = 'Дом';
  } else if (adsArray[i].offer.type === 'palace') {
    typeTranslate = 'Дворец';
  }
  adElement.querySelector('.popup__type').textContent = typeTranslate;
  adElement.querySelector('.popup__text--capacity').textContent = adsArray[i].offer.rooms + ' комнаты для ' + adsArray[i].offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + adsArray[i].offer.checkin + ', выезд до ' + adsArray[i].offer.checkout;
  var featuresList = adElement.querySelector('.popup__features');
  featuresList.innerHTML = '';
  adsArray[i].offer.features.forEach(function (feature) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('popup__feature', 'popup__feature--' + feature);
    featuresList.appendChild(featureElement);
  });
  adElement.querySelector('.popup__description').textContent = adsArray[i].offer.description;
  var photoFragment = document.createDocumentFragment();
  adsArray[i].offer.photos.forEach(function (photo) {
    var photoElement = document.querySelector('template').content.querySelector('.popup__photo').cloneNode(true);
    photoElement.src = photo;
    photoFragment.appendChild(photoElement);
  });
  adElement.querySelector('.popup__photos').innerHTML = '';
  adElement.querySelector('.popup__photos').appendChild(photoFragment);
  adElement.querySelector('.popup__avatar').src = adsArray[i].author.avatar;
  adFragment.appendChild(adElement);
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
var popup;

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
  // ищем открытый попап и если он есть, удаляем его
  var openedPopup = map.querySelector('.map__card');
  if (openedPopup !== null) {
    map.removeChild(openedPopup);
  }
};

// функция открытия попапа
var openPopup = function (item) {
  // получаем значение id объявления для отрисовки попапа
  var popupId;
  // currentTarget - ловим кнопку (в хроме и мозилле по target события отрабатывают по разному, хром ловит нажатие по картинке)
  popupId = item.currentTarget.attributes.getNamedItem('data-target').value;

  // отрисовка и вставка попапа объявления
  var adPopup = drawAd(ads, popupId);
  map.insertBefore(adPopup, map.querySelector('.map__filters-container'));

  // ловим отрисованный попап и регистрируем кнопке закрытия обработчики
  popup = document.querySelector('.map__card');
  var popupCloser = popup.querySelector('.popup__close');
  popupCloser.addEventListener('mouseup', popupCloseClickHandler);
  popupCloser.addEventListener('keydown', popupCloseEnterHandler);
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

// вводим переменные, ищем блоки
var typeSelect = document.querySelector('#type');
var priceInput = document.querySelector('#price');
// функция смены атрибутов, принимает 2 параметра элемент и новое значение атрибута
var changeInputOptions = function (item, value) {
  item.setAttribute('min', value);
  item.setAttribute('placeholder', value);
};
// функция обработчика изменения типа жилья
var changeTypeSelect = function (evt) {
  if (evt.target.value === 'bungalo') {
    changeInputOptions(priceInput, 0);
  } else if (evt.target.value === 'flat') {
    changeInputOptions(priceInput, 1000);
  } else if (evt.target.value === 'house') {
    changeInputOptions(priceInput, 5000);
  } else if (evt.target.value === 'palace') {
    changeInputOptions(priceInput, 10000);
  }
};
// добавляем обработчик изменения типа жилья
typeSelect.addEventListener('change', changeTypeSelect);

// вводим переменные, ищем блоки
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');

// функция обработчика изменения времени заезда/выезда
var changeTimeInOutSelect = function (evt) {
  var id = evt.target.attributes.getNamedItem('id').value;
  var select;
  if (id === 'timein') {
    select = document.querySelector('#timeout');
  } else if (id === 'timeout') {
    select = document.querySelector('#timein');
  }
  select.value = evt.target.value;
};

timeIn.addEventListener('change', changeTimeInOutSelect);
timeOut.addEventListener('change', changeTimeInOutSelect);

// вводим переменные, ищем блоки
var roomNumber = document.querySelector('#room_number');
var capacity = document.querySelector('#capacity');
var capacityOptions = capacity.querySelectorAll('option');
var roomNumberCapacity = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};
// функция изменения атрибутов
var setDisabledAttr = function (element) {
  // бежим по списку элементов
  capacityOptions.forEach(function (option) {
    // если value элемента не входит в массив то выключаем его и снимаем атрибут selected
    if (element.indexOf(option.value) === -1) {
      option.setAttribute('disabled', 'disabled');
      option.removeAttribute('selected');
    } else { // если входит в массив то включаем
      option.removeAttribute('disabled');
      option.removeAttribute('selected');
    }
  });
};

var changeRoomNumberSelect = function (evt) {
  var value = evt.target.value;
  var selectValue = roomNumberCapacity[value];
  setDisabledAttr(selectValue);
  // выбираем первый не НЕактивный элемент и устанавливаем ему атрибут selected
  var selectedOption = capacity.querySelector('option:not([disabled])');
  selectedOption.setAttribute('selected', 'selected');
  // принудительное изменение select с количеством гостей для mozilla/edge
  capacity.value = selectValue[0];
};

roomNumber.addEventListener('change', changeRoomNumberSelect);
