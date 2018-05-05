'use strict';
(function () {
  // вводим константы со значениями адресов получения данных, отправки данных, таймаута и статуса
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_URL = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;
  var STATUS_OK = 200;

  // функция отправки
  var send = function (data, onLoad, onError) {
    // создаем новый объект и указываем тип принимаемых данных (придет json)
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    // обработчик загрузки
    xhr.addEventListener('load', function () {
      // проверка статуса
      if (xhr.status === STATUS_OK) {
        // парсим полученное
        onLoad(xhr.response);
      } else {
        // кидаем ошибку
        onError('Не известный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    // обработчик ошибки
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединеия');
    });
    // обработчик таймаута
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    xhr.open('POST', POST_URL);
    xhr.send(data);
  };
  // функция получения данных
  var recieve = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    // обработчик загрузки
    xhr.addEventListener('load', function () {
      onLoad(xhr.response);
    });
    // обработчик ошибки
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.timeout = TIMEOUT;
    xhr.open('GET', GET_URL);
    xhr.send();
  };
  // функция создания сообщения об ошибке
  var error = function (errorMessage) {
    // создаем div
    var errorElement = document.createElement('div');
    // вешаем стили, добавляем сообщение, вставляем в body
    errorElement.style = 'width: 100%; left: 0; top: 0; padding: 20px; z-index: 100; position: fixed; font-size: 20px; text-align: center; background-color: #ffaa99; color: #fff';
    errorElement.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', errorElement);
    // после 3 сек удаляем
    setTimeout(function () {
      document.body.removeChild(errorElement);
    }, 3000);
  };
  // экспорт в глобальную область видимости
  window.backend = {
    upload: send,
    download: recieve,
    error: error
  };
})();
