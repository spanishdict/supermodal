!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.SuperModal=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"SuperModal":[function(require,module,exports){
'use strict';

var TRIM_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
MODAL_SHOW_CLA = 'supermodal-show',
MODAL_BODY_SHOW_CLA = 'supermodal-body-show',
BACKDROP_CLA = 'supermodal-backdrop',
POSITIONER_CLA = 'supermodal-positioner',
CLOSE_BTN_CLA = 'supermodal-close',
NOT_MOBILE_HTML_CLA = 'supermodal-not-mobile',

_slice = Array.prototype.slice,

_extend = function(out) {
  out = out || {};
  var i, key;
  for (i = 1; i < arguments.length; i++) {
    if (arguments[i]) {
      for (key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          out[key] = arguments[i][key];
        }
      }
    }
  }
  return out;
},

trim = function (str) {
  return str.replace(TRIM_REGEX, '');
},

addClass = (function () {
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

removeClass = (function () {
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

getElementsByClassName = (function () {
  if (document.getElementsByClassName) {
    return function (el, className) {
      if (className === null && className === undefined) {
        className = el;
        el = document;
      }
      return el.getElementsByClassName(className);
    };
  }
  return function (el, className) {
    if (className === null && className === undefined) {
      className = el;
      el = document;
    }
    return el.querySelectorAll('.' + className);
  };
})(),

listen = (function () {
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
})(),

getPageScrollTop = function () {
  return ('pageYOffset' in window) ?
    window.pageYOffset : document.documentElement.scrollTop;
},

getDocHeight = function () {
  var d = document;
  return Math.max(
    d.body.scrollHeight, d.documentElement.scrollHeight,
    d.body.offsetHeight, d.documentElement.offsetHeight,
    d.body.clientHeight, d.documentElement.clientHeight
  );
},

DEFAULT_OPTS = {
  isMobile: true
},

/**
 * SuperModal constructor
 * @param {HTMLElement} rootElement - the root element of the modal
 * @param {JSON} [opts]
 * @param {bool} [opts.isMobile=true] - specify this modal behave in mobile
 *                                    mode or not
 */
SuperModal = function (rootElement, opts) {
  this.opts = _extend({}, DEFAULT_OPTS, opts);

  if (!this.opts.isMobile) {
    addClass(document.documentElement, NOT_MOBILE_HTML_CLA);
  }

  this.root = rootElement;
  this.positioner = getElementsByClassName(this.root, POSITIONER_CLA)[0];
  this.onHideCallbacks = [];
  this.isOpen = false;
  this.touching = false;
  this.touchTimer = null;

  var self = this;

  var backdrop = getElementsByClassName(this.root, BACKDROP_CLA)[0];
  listen(backdrop, 'click', function () {
    self.hide();
  });

  var closeBtn = getElementsByClassName(this.root, CLOSE_BTN_CLA)[0];
  listen(closeBtn, 'click', function () {
    self.hide();
  });

  if (this.opts.isMobile) {
    listen(this.root, 'touchstart', function () {
      self.touching = true;
      self.clearTouchTimer();
    });

    listen(this.root, 'touchend', function () {
      self.setTouchTimer();
    });

    listen(this.root, 'touchcancel', function () {
      self.setTouchTimer();
    });

    listen(document, 'scroll', function () {
      if (!self.isOpen) {
        return;
      }
      if (getPageScrollTop() < 0 && !self.touching) {
        self.touching = true;
        self.setTouchTimer();
      }
      if (getPageScrollTop() === 0 && !self.touching) {
        self.resetPageScrollTop();
        self.hide();
      }
    });
  }
};

SuperModal.prototype.setTouchTimer = function () {
  var self = this;
  clearTimeout(this.touchTimer);
  this.touchTimer = setTimeout(function () {
    self.touching = false;
    self.touchTimer = null;
  }, 350);
};

SuperModal.prototype.clearTouchTimer = function () {
  clearTimeout(this.touchTimer);
  this.touchTimer = null;
};

SuperModal.prototype.show = function () {
  var marginTop;
  this.pageScrollTop = getPageScrollTop();
  addClass(document.body, MODAL_BODY_SHOW_CLA);
  addClass(this.root, MODAL_SHOW_CLA);
  if (this.opts.isMobile) {
    this.root.style.height = getDocHeight() + 'px';
    marginTop = (window.innerHeight - this.positioner.offsetHeight) / 2;
    this.positioner.style.top = this.pageScrollTop + marginTop + 'px';
  }
  this.isOpen = true;
};

SuperModal.prototype.resetPageScrollTop = function () {
  window.scrollTo(0, this.pageScrollTop);
};

SuperModal.prototype.hide = function () {
  var i;
  removeClass(this.root, MODAL_SHOW_CLA);
  removeClass(document.body, MODAL_BODY_SHOW_CLA);
  this.hideVirtualKeyboard();
  this.isOpen = false;
  this.clearTouchTimer();
  for (i = 0; i < this.onHideCallbacks.length; i++) {
    this.onHideCallbacks[i]();
  }
};

SuperModal.prototype.hideVirtualKeyboard = function () {
  var i;
  if (!this.opts.isMobile) {
    return;
  }
  document.activeElement.blur();
  // Call slice to convert to array
  var inputs = _slice.call(this.positioner.getElementsByTagName('input'));
  var textareas = _slice.call(this.positioner.getElementsByTagName('textarea'));
  inputs = inputs.concat(textareas);
  for (i = 0; i < inputs.length; i++) {
    inputs[i].blur();
  }
};

SuperModal.prototype.onHide = function (cb) {
  this.onHideCallbacks.push(cb);
};

module.exports = SuperModal;

},{}]},{},[])("SuperModal")
});