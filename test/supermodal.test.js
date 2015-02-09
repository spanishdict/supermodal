'use strict';

var $ = require('jquery');
var EventHelper = require('../lib/event');
var SuperModal = require('../supermodal');

describe('SuperModal', function () {
  beforeEach(function () {
    loadFixtures('supermodal-fixture.html');
  });

  describe('constructor', function () {
    it('should assign properties correctly', function () {
      var modal = new SuperModal($('#the-modal')[0]);

      expect(modal.opts).toEqual({isMobile: true});
      expect(modal.root).toBe($('#the-modal')[0]);
      expect(modal.positioner).toBe($('#the-modal .supermodal-positioner')[0]);
      expect(modal.onHideCallbacks).toEqual([]);
      expect(modal.isOpen).toBe(false);
      expect(modal.touching).toBe(false);
      expect(modal.touchTimer).toBeNull(null);
    });

    it('should honor `isMobile` option and add class to HTML tag', function () {
      new SuperModal($('#the-modal')[0]);
      expect($('html').hasClass('supermodal-not-mobile')).toBe(false);

      new SuperModal($('#the-modal')[0], {isMobile: false});
      expect($('html').hasClass('supermodal-not-mobile')).toBe(true);
    });

    it('should attach event listeners', function () {
      var argsArr = [
        [$('#the-modal .supermodal-backdrop')[0], 'click'],
        [$('#the-modal .supermodal-close')[0]   , 'click'],
        [$('#the-modal')[0]                     , 'touchstart'],
        [$('#the-modal')[0]                     , 'touchend'],
        [$('#the-modal')[0]                     , 'touchcancel'],
        [document                               , 'scroll']
      ];

      spyOn(EventHelper, 'listen').and.callFake(function(el, eventName, cb) {
        var args = argsArr.shift();
        expect(el).toBe(args[0]);
        expect(eventName).toBe(args[1]);
      });

      var modal = new SuperModal($('#the-modal')[0], {isMobile: true});

      expect(argsArr.length).toBe(0);
    });
  });

  describe('setTouchTimer', function () {
    it('should clean previous timer and setup a timer to change properties', function (done) {
      var modal = new SuperModal($('#the-modal')[0], {isMobile: true});
      modal.touching = true;
      modal.touchTimer = setTimeout(function () {
        done(new Error('should not execute'));
      });

      modal.setTouchTimer();

      setTimeout(function () {
        expect(modal.touching).toBe(false);
        expect(modal.touchTimer).toBe(null);
        done();
      }, 500);
    });
  });

  describe('clearTouchTimer', function () {
    it('should clean touchTimer', function (done) {
      var modal = new SuperModal($('#the-modal')[0], {isMobile: true});
      modal.touchTimer = setTimeout(function () {
        done(new Error('should not execute'));
      });
      modal.clearTouchTimer();
      setTimeout(done, 100);
    });
  });

  describe('show', function () {
    it('should remember page scroll top', function () {
      var modal = new SuperModal($('#the-modal')[0], {isMobile: true});

      expect($('body').hasClass('supermodal-body-show')).toBe(false);
      expect($('#the-modal').hasClass('supermodal-show')).toBe(false);
      expect(modal.pageScrollTop).toBeUndefined();

      modal.show();

      expect($('body').hasClass('supermodal-body-show')).toBe(true);
      expect($('#the-modal').hasClass('supermodal-show')).toBe(true);
      expect($('#the-modal').css('height')).toMatch(/^\d+px$/); // TODO: more precise
      expect(modal.pageScrollTop).toBe(0);
    });
  });

  describe('resetPageScrollTop', function () {
    it('should scroll page to modal open position', function () {
      // Couldn't really test it, yet.
    });
  });

  describe('hide', function () {
    it('should', function () {
      var modal = new SuperModal($('#the-modal')[0], {isMobile: true});
      modal.show();

      expect($('body').hasClass('supermodal-body-show')).toBe(true);
      expect($('#the-modal').hasClass('supermodal-show')).toBe(true);

      modal.hide();

      expect($('body').hasClass('supermodal-body-show')).toBe(false);
      expect($('#the-modal').hasClass('supermodal-show')).toBe(false);
    });
  });

  describe('hideVirtualKeyboard', function () {
    it('should force iOS software keyboard to hide', function () {
      // Couldn't really test it, yet.
    });
  });

  describe('onHide', function () {
    it('should add onHide callbacks', function () {
      var modal = new SuperModal($('#the-modal')[0], {isMobile: true});
      expect(modal.onHideCallbacks.length).toBe(0);
      modal.onHide(function () {});
      modal.onHide(function () {});
      expect(modal.onHideCallbacks.length).toBe(2);
    });
  });

  it('should close when backdrop clicked', function () {
    var modal = new SuperModal($('#the-modal')[0], {isMobile: true});
    modal.show();
    $('#the-modal .supermodal-backdrop').click();
    expect($('#the-modal').hasClass('supermodal-show')).toBe(false);
  });

  it('should close when close button clicked', function () {
    var modal = new SuperModal($('#the-modal')[0], {isMobile: true});
    modal.show();
    $('#the-modal .supermodal-close').click();
    expect($('#the-modal').hasClass('supermodal-show')).toBe(false);
  });
});
