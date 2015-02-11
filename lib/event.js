// Most of the methods are referenced from
// http://code.jquery.com/jquery-1.11.2.js

'use strict';

module.exports = {
  listen: (function () {
    if (document.addEventListener) {
      return function (el, eventName, callback) {
        el.addEventListener(eventName, callback, false);
      };
    }
    return function (el, eventName, callback) {
      el.attachEvent('on' + eventName, function () {
        return callback.apply(el, arguments);
      });
    };
  })()
};
