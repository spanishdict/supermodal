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
