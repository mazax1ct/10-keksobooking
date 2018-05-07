'use strict';
(function () {
  var map = document.querySelector('.map'); // блок карты
  var adTemplate = document.querySelector('template').content.querySelector('.map__card'); // выбираем шаблон для попапа

  // функция отрисовки попапа принимает массив данных и id для выбора элемента из массива
  var drawPopup = function (adsArray, i) {
    // создаем фрагмент
    var adFragment = document.createDocumentFragment();
    // копируем разметку
    var adElement = adTemplate.cloneNode(true);
    // пишем заголовок
    adElement.querySelector('.popup__title').textContent = adsArray[i].offer.title;
    // пишем адрес
    adElement.querySelector('.popup__text--address').textContent = adsArray[i].offer.address;
    // пишем цену
    adElement.querySelector('.popup__text--price').textContent = adsArray[i].offer.price + '₽/ночь';
    // в соответствии с типом жилья устанавливаем значение
    var typeTranslate = '';
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
    // пишем комнаты и кол-во гостей
    adElement.querySelector('.popup__text--capacity').textContent = adsArray[i].offer.rooms + ' комнаты для ' + adsArray[i].offer.guests + ' гостей';
    // пишем время заезда/выезда
    adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + adsArray[i].offer.checkin + ', выезд до ' + adsArray[i].offer.checkout;
    // пишем перебираем массив доп. услуг и рисуем блоки
    var featuresList = adElement.querySelector('.popup__features');
    featuresList.innerHTML = '';
    adsArray[i].offer.features.forEach(function (feature) {
      var featureElement = document.createElement('li');
      featureElement.classList.add('popup__feature', 'popup__feature--' + feature);
      featuresList.appendChild(featureElement);
    });
    // пишем описание
    adElement.querySelector('.popup__description').textContent = adsArray[i].offer.description;
    // перебираем массив с картинками и рисуем блоки
    var photoFragment = document.createDocumentFragment();
    adsArray[i].offer.photos.forEach(function (photo) {
      var photoElement = document.querySelector('template').content.querySelector('.popup__photo').cloneNode(true);
      photoElement.src = photo;
      photoFragment.appendChild(photoElement);
    });
    adElement.querySelector('.popup__photos').innerHTML = '';
    adElement.querySelector('.popup__photos').appendChild(photoFragment);
    // рисуем аватар
    adElement.querySelector('.popup__avatar').src = adsArray[i].author.avatar;
    // вставляем новую разметку в фрагмент
    adFragment.appendChild(adElement);
    // возвращаем фрагмент
    return adFragment;
  };

  window.popup = {
    // функция закрытия попапа
    close: function () {
      // ищем открытый попап и если он есть, удаляем его и заодно убираем обработчик прослушивание нажатия esc
      var openedPopup = map.querySelector('.map__card');
      if (openedPopup !== null) {
        map.removeChild(openedPopup);
        document.removeEventListener('keydown', popupCloseEscHandler);
      }
    },
    // функция открытия попапа
    open: function (item) {
      // закрываем открытый попап
      window.popup.close();
      // получаем значение id объявления для отрисовки попапа
      var popupId;
      // currentTarget - ловим кнопку (в хроме и мозилле по target события отрабатывают по разному, хром ловит нажатие по картинке)
      popupId = item.currentTarget.attributes.getNamedItem('data-target').value;

      // отрисовка и вставка попапа объявления (данные берем из глобальной области видимости, т.к. ранее их туда уже экспортировали)
      var adPopup = drawPopup(window.ads, popupId);
      map.insertBefore(adPopup, map.querySelector('.map__filters-container'));

      // ловим отрисованный попап и регистрируем кнопке закрытия обработчики и обработчик закрытия по esc
      var popup = document.querySelector('.map__card');
      var popupCloser = popup.querySelector('.popup__close');
      // навешиваем обработчики
      popupCloser.addEventListener('mouseup', popupCloseClickHandler);
      popupCloser.addEventListener('keydown', popupCloseEnterHandler);
      document.addEventListener('keydown', popupCloseEscHandler);
    }
  };

  // функция обработчика клика по кнопке закрытия попапа
  var popupCloseClickHandler = function () {
    window.popup.close();
  };

  // функция обработчика нажатия enter по кнопке закрытия попапа
  var popupCloseEnterHandler = function (evt) {
    window.util.isEnterEvent(evt, window.popup.close);
  };

  // функция обработчика нажатия esc по кнопке закрытия попапа
  var popupCloseEscHandler = function (evt) {
    window.util.isEscEvent(evt, window.popup.close);
  };
})();
