require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"supermodal":[function(require,module,exports){
'use strict';

var TRIM_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
MODAL_CLA           = 'supermodal-root',
MODAL_SHOW_CLA      = 'supermodal-show',
MODAL_BODY_SHOW_CLA = 'supermodal-body-show',
BACKDROP_CLA        = 'supermodal-backdrop',
POSITIONER_CLA      = 'supermodal-positioner',
CLOSE_BTN_CLA       = 'supermodal-close',
NOT_MOBILE_HTML_CLA = 'supermodal-not-mobile',

_slice = Array.prototype.slice,

trim = function (str) {
  return str.replace(TRIM_REGEX, '');
},

addClass = (function () {
  if (document.documentElement.classList) {
    return function (el, className) {
      el.classList.add(className);
    };
  } else {
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
  }
})(),

removeClass = (function () {
  if (document.documentElement.classList) {
    return function (el, className) {
      el.classList.remove(className);
    };
  } else {
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
  }
})(),

getElementsByClassName = (function () {
  if (document.getElementsByClassName) {
    return function (el, className) {
      if (className == null) {
        className = el;
        el = document;
      }
      return el.getElementsByClassName(className);
    };
  } else {
    return function (el, className) {
      if (className == null) {
        className = el;
        el = document;
      }
      return el.querySelectorAll('.' + className);
    }
  }
})(),

addEventListener = (function () {
  if (document.addEventListener) {
    return function (el, eventName, callback) {
      el.addEventListener(eventName, callback, false);
    };
  } else {
    return function (el, eventName, callback) {
      el.attachEvent('on' + eventName, function (event) {
        return callback.apply(el, arguments);
      });
    };
  }
})(),

getPageScrollTop = function () {
  return ('pageYOffset' in window) ? window['pageYOffset'] : document.documentElement['scrollTop'];
},

getDocHeight = function () {
  var d = document;
  return Math.max(
    d.body.scrollHeight, d.documentElement.scrollHeight,
    d.body.offsetHeight, d.documentElement.offsetHeight,
    d.body.clientHeight, d.documentElement.clientHeight
  );
},

Modal = function (rootElement, notMobile) {
  if (notMobile) {
    addClass(document.documentElement, NOT_MOBILE_HTML_CLA);
  }

  this.root            = rootElement;
  this.isMobile        = !notMobile;
  this.positioner      = getElementsByClassName(this.root, POSITIONER_CLA)[0];
  this.onHideCallbacks = [];
  this.isOpen          = false;
  this.touching        = false;
  this.touchTimer;

  var _this = this;

  var backdrop = getElementsByClassName(this.root, BACKDROP_CLA)[0];
  addEventListener(backdrop, 'click', function () {
    _this.hide();
  });

  var closeBtn = getElementsByClassName(this.root, CLOSE_BTN_CLA)[0];
  addEventListener(closeBtn, 'click', function () {
    _this.hide();
  });

  if (this.isMobile) {
    addEventListener(this.root, 'touchstart', function () {
      _this.touching = true;
      _this.clearTouchTimer();
    });

    addEventListener(this.root, 'touchend', function () {
      // if (_this.touchTimer) return;
      _this.setTouchTimer();
    });

    addEventListener(this.root, 'touchcancel', function () {
      // if (_this.touchTimer) return;
      _this.setTouchTimer();
    });

    addEventListener(document, 'scroll', function () {
      if (!_this.isOpen) return;
      if (getPageScrollTop() < 0 && !_this.touching) {
        _this.touching = true;
        _this.setTouchTimer();
      }
      if (getPageScrollTop() === 0 && !_this.touching) {
        _this.resetPageScrollTop();
        _this.hide();
      }
    });
  }
};

Modal.prototype.setTouchTimer = function () {
  var _this = this;
  clearTimeout(this.touchTimer);
  this.touchTimer = setTimeout(function () {
    _this.touching = false;
    _this.touchTimer = null;
  }, 350);
};

Modal.prototype.clearTouchTimer = function () {
  clearTimeout(this.touchTimer);
  this.touchTimer = null;
};

Modal.prototype.show = function () {
  this.pageScrollTop = getPageScrollTop();
  addClass(document.body, MODAL_BODY_SHOW_CLA);
  addClass(this.root, MODAL_SHOW_CLA);
  if (this.isMobile) {
    this.root.style.height = getDocHeight() + 'px';
    this.positioner.style.top = this.pageScrollTop + (window.innerHeight - this.positioner.offsetHeight) / 2 + 'px';
  }
  this.isOpen = true;
};

Modal.prototype.resetPageScrollTop = function () {
  window.scrollTo(0, this.pageScrollTop);
};

Modal.prototype.hide = function () {
  removeClass(this.root, MODAL_SHOW_CLA);
  removeClass(document.body, MODAL_BODY_SHOW_CLA);
  this.hideVirtualKeyboard();
  this.isOpen = false;
  this.clearTouchTimer();
  for (var i = 0; i < this.onHideCallbacks.length; i++) {
    this.onHideCallbacks[i]();
  }
};

Modal.prototype.hideVirtualKeyboard = function () {
  if (!this.isMobile) return;
  document.activeElement.blur();
  // Call slice to convert to array
  var inputs = _slice.call(this.positioner.getElementsByTagName('input'));
  inputs = inputs.concat(_slice.call(this.positioner.getElementsByTagName('textarea')));
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].blur();
  }
};

Modal.prototype.onHide = function (cb) {
  this.onHideCallbacks.push(cb);
};

module.exports = Modal;

},{}]},{},[]);
