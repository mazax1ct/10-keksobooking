'use strict';
(function () {
  var adForm = document.querySelector('.ad-form');
  var resetBtn = adForm.querySelector('.ad-form__reset');
  var success = document.querySelector('.success');

  window.form = {
    // инициализаци формы
    init: function (form, elements) {
      // убираем класс затенения
      form.classList.remove('ad-form--disabled');
      // снимаем атрибуты disabled с полей
      elements.forEach(function (element) {
        element.removeAttribute('disabled');
      });
    },
    // сброс формы
    reset: function () {
      // просто перезагружаем страницу
      window.location.reload();
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

  // обработчик на успешную отправку формы
  var onFormSubmit = function (evt) {
    // убираем поведение по умолчанию
    evt.preventDefault();

    // если форма валидна, отправляем и показываем блок с сообщением об успехе, если нет, показываем ошибку
    window.backend.upload(new FormData(adForm), function () {
      success.classList.remove('hidden');
      // через 3 сек скрываем сообщение об успехе
      setTimeout(function () {
        success.classList.add('hidden');
        // сбрасываем форму
        window.form.reset();
      }, 3000);
    }, window.backend.error);
  };

  adForm.addEventListener('submit', onFormSubmit);

  // сброс формы
  resetBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.form.reset();
  });
})();
