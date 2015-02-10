// Most of the methods are referenced from
// http://code.jquery.com/jquery-1.11.2.js

'use strict';

var Util = require('./util');
var trim = Util.trim;

module.exports = {
  addClass: (function () {
    if (document.documentElement.classList) {
      return function (el, className) {
        el.classList.add(className);
      };
    }
    return function (el, className) {
      var cur = (' ' + el.className + ' '), name = ' ' + className + ' ';

      if (cur.indexOf(name) < 0) {
        cur += className;
      }

      var finalValue = trim(cur);
      if (el.className !== finalValue) {
        el.className = finalValue;
      }
    };
  })(),

  removeClass: (function () {
    if (document.documentElement.classList) {
      return function (el, className) {
        el.classList.remove(className);
      };
    }
    return function (el, className) {
      var cur = (' ' + el.className + ' '), name = ' ' + className + ' ';

      while (cur.indexOf(name) > -1) {
        cur = cur.replace(name, ' ');
      }

      var finalValue = trim(cur);
      if (el.className !== finalValue) {
        el.className = finalValue;
      }
    };
  })(),

  getElementsByClassName: (function () {
    if (document.getElementsByClassName) {
      return function (el, className) {
        if (className == null) {
          className = el;
          el = document;
        }
        return el.getElementsByClassName(className);
      };
    }
    return function (el, className) {
      if (className == null) {
        className = el;
        el = document;
      }
      return el.querySelectorAll('.' + className);
    };
  })(),

  getPageScrollTop: function () {
    return ('pageYOffset' in window) ?
      window.pageYOffset : document.documentElement.scrollTop;
  },

  getDocHeight: function () {
    var d = document;
    return Math.max(
      d.body.scrollHeight, d.documentElement.scrollHeight,
      d.body.offsetHeight, d.documentElement.offsetHeight,
      d.body.clientHeight, d.documentElement.clientHeight
    );
  }
};
