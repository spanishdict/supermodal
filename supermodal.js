'use strict';

var Util = require('./lib/util');
var DOM = require('./lib/dom');
var EventHelper = require('./lib/event');

var MODAL_SHOW_CLA = 'supermodal-show',
MODAL_BODY_SHOW_CLA = 'supermodal-body-show',
BACKDROP_CLA = 'supermodal-backdrop',
POSITIONER_CLA = 'supermodal-positioner',
CLOSE_BTN_CLA = 'supermodal-close',
NOT_MOBILE_HTML_CLA = 'supermodal-not-mobile',

_extend = Util.extend,
addClass = DOM.addClass,
removeClass = DOM.removeClass,
getElementsByClassName = DOM.getElementsByClassName,
getPageScrollTop = DOM.getPageScrollTop,
getDocHeight = DOM.getDocHeight,

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
  EventHelper.listen(backdrop, 'click', function () {
    self.hide();
  });

  var closeBtn = getElementsByClassName(this.root, CLOSE_BTN_CLA)[0];
  EventHelper.listen(closeBtn, 'click', function () {
    self.hide();
  });

  if (this.opts.isMobile) {
    EventHelper.listen(this.root, 'touchstart', function () {
      self.touching = true;
      self.clearTouchTimer();
    });

    EventHelper.listen(this.root, 'touchend', function () {
      self.setTouchTimer();
    });

    EventHelper.listen(this.root, 'touchcancel', function () {
      self.setTouchTimer();
    });

    EventHelper.listen(document, 'scroll', function () {
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
  var marginTop, windowHeight;
  this.pageScrollTop = getPageScrollTop();
  addClass(document.body, MODAL_BODY_SHOW_CLA);
  addClass(this.root, MODAL_SHOW_CLA);
  if (this.opts.isMobile) {
    this.root.style.height = getDocHeight() + 'px';
    windowHeight = window.innerHeight || document.documentElement.clientHeight;
    marginTop = (windowHeight - this.positioner.offsetHeight) / 2;
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
  var inputs = this.positioner.getElementsByTagName('input');
  for (i = 0; i < inputs.length; i++) {
    inputs[i].blur();
  }
  var textareas = this.positioner.getElementsByTagName('textarea');
  for (i = 0; i < textareas.length; i++) {
    textareas[i].blur();
  }
};

SuperModal.prototype.onHide = function (cb) {
  this.onHideCallbacks.push(cb);
};

module.exports = SuperModal;
