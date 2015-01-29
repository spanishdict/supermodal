'use strict';

var TRIM_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
POSITIONER_CLA = 'js-modal-positioner',
BACKDROP_CLA = 'js-modal-backdrop',
MODAL_SHOW_BODY_CLA = 'o-modal-body-show',
MODAL_SHOW_CLA = 'o-modal-show',
IS_MOBILE_HTML_CLA = 'is-mobile',
NOT_MOBILE_HTML_CLA = 'is-not-mobile',

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

      var finalValue = cur.replace(TRIM_REGEX, '');
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

      var finalValue = cur.replace(TRIM_REGEX, '');
      if (el.className !== finalValue) {
        el.className = finalValue;
      }
    };
  }
})(),

getElementsByClassName = (function () {
  if (document.getElementsByClassName) {
    return function (el, className) {
      if (className === undefined) {
        className = el;
        el = document;
      }
      return el.getElementsByClassName(className);
    };
  } else {
    return function (el, className) {
      if (className === undefined) {
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

Modal = function (rootElement, isMobile) {
  this.isMobile = isMobile;
  this.root = rootElement;
  this.positioner = getElementsByClassName(this.root, POSITIONER_CLA)[0];
  this.onHideCallbacks = [];
  this.isOpen = false;

  var _this = this;

  var backdrop = getElementsByClassName(this.root, BACKDROP_CLA)[0];
  addEventListener(backdrop, 'click', function () {
    _this.hide();
  });

  addEventListener(document, 'scroll', function () {
    if (_this.isOpen && getPageScrollTop() === 0) {
      _this.hide();
    }
  });
};

Modal.prototype.show = function () {
  this.pageScrollTop = getPageScrollTop();
  addClass(document.body, MODAL_SHOW_BODY_CLA);
  addClass(this.root, MODAL_SHOW_CLA);
  if (this.isMobile) {
    this.root.style.height = getDocHeight() + 'px';
    this.positioner.style.top = this.pageScrollTop + (window.innerHeight - this.positioner.offsetHeight) / 2 + 'px';
  }
  this.isOpen = true;
};

Modal.prototype.hide = function () {
  window.scrollTo(0, this.pageScrollTop);
  removeClass(this.root, MODAL_SHOW_CLA);
  removeClass(document.body, MODAL_SHOW_BODY_CLA);
  if (this.isMobile) {
    document.activeElement.blur();
    var inputs = this.positioner.getElementsByTagName('input');
    inputs = inputs.concat(this.positioner.getElementsByTagName('textarea'));
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].blur();
    }
  }
  this.isOpen = false;
  while (this.onHideCallbacks.length) {
    this.onHideCallbacks.shift()();
  }
};

Modal.prototype.onHide = function (cb) {
  this.onHideCallbacks.push(cb);
};

module.exports = Modal;
