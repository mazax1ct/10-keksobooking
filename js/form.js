'use strict';
(function () {
  var adForm = document.querySelector('.ad-form'); // форма
  var formFieldset = document.querySelectorAll('.map__filter, .map__features, .ad-form__element'); // ищем не активные элементы форм
  var resetBtn = adForm.querySelector('.ad-form__reset'); // кнопка сброса
  var success = document.querySelector('.success'); // блок "успех"
  var typeSelect = adForm.querySelector('#type'); // селект тип жилья
  var priceInput = adForm.querySelector('#price'); // инпут цена
  var timeIn = adForm.querySelector('#timein'); // селект время въезда
  var timeOut = adForm.querySelector('#timeout'); // селект время выезда
  var roomNumber = adForm.querySelector('#room_number'); // селект кол-во комнат
  var capacity = adForm.querySelector('#capacity'); // селект кол-во мест
  var capacityOptions = capacity.querySelectorAll('option'); // выбор option из селекта кол-во мест
  var roomNumberCapacity = { // соответствие значений value кол-ва номеров и value option из селект кол-во мест
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var pageReset = function () {
    window.map.reset();
    window.pins.remove();
    window.popup.close();
    window.filter.reset();
    window.form.reset();
    window.pin.reset();
  };

  window.form = {
    // инициализаци формы
    init: function () {
      // убираем класс затенения
      adForm.classList.remove('ad-form--disabled');
      // снимаем атрибуты disabled с полей
      formFieldset.forEach(function (element) {
        element.removeAttribute('disabled');
      });
    },
    // сброс формы
    reset: function () {
      // добавляем класс затенения
      adForm.classList.add('ad-form--disabled');
      // сбрасываем значения полей формы
      adForm.reset();
      // вешаем атрибуты disabled на поля
      formFieldset.forEach(function (element) {
        element.setAttribute('disabled', 'disabled');
      });
    }
  };

  // ************ действия с элементами формы ************

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

  // функция обработчика изменения времени заезда/выезда
  var changeTimeInOutSelect = function (evt) {
    // получаем id элемента который меняем
    var id = evt.target.attributes.getNamedItem('id').value;
    var select;
    // проеряем id и устанавливаем какой из парных элементов нужно менять
    if (id === 'timein') {
      select = timeOut;
    } else if (id === 'timeout') {
      select = timeIn;
    }
    // устанавливаем новое значение парному селекту
    select.value = evt.target.value;
  };

  // вешаем обработчик на селекты
  timeIn.addEventListener('change', changeTimeInOutSelect);
  timeOut.addEventListener('change', changeTimeInOutSelect);

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

  // функция обработчика изменения селекта с кол-вом комнат
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
  // навешиваем обработчик
  roomNumber.addEventListener('change', changeRoomNumberSelect);

  // обработчик на успешную отправку формы
  var onFormSubmit = function (evt) {
    // убираем поведение по умолчанию
    evt.preventDefault();
    // если форма валидна, отправляем и показываем блок с сообщением об успехе, если нет, показываем ошибку (new FormData(adForm) создает форму с данными из нашей формы)
    window.backend.upload(new FormData(adForm), function () {
      // показываем блок успеха
      success.classList.remove('hidden');
      // через 3 сек скрываем сообщение об успехе
      setTimeout(function () {
        success.classList.add('hidden');
        // сбрасываем страницу
        pageReset();
      }, 3000);
    }, window.backend.error);
  };

  // навешиваем обработчик на отправку формы
  adForm.addEventListener('submit', onFormSubmit);

  // сброс формы
  resetBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    pageReset();
  });
})();
