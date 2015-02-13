'use strict';

var $ = require('jquery');
var EventHelper = require('../lib/event');
var SuperModal = require('../supermodal');

describe('SuperModal', function () {
  beforeEach(function () {
    loadFixtures('test/supermodal-fixture.html');
  });

  afterEach(function () {
    cleanFixtures();
  });

  describe('constructor', function () {
    it('should fail smoothly', function () {
      try {
        var modal = new SuperModal($('#does-not-exist'));
      } catch (err) {
        expect(err).to.be.ok
      }
    });

    it('should assign properties correctly', function () {
      var modal = new SuperModal($('#the-modal')[0]);

      expect(modal.opts).eql({isMobile: true});
      expect(modal.root).equal($('#the-modal')[0]);
      expect(modal.positioner).equal($('#the-modal .supermodal-positioner')[0]);
      expect(modal.onHideCallbacks).eql([]);
      expect(modal.isOpen).equal(false);
      expect(modal.touching).equal(false);
      expect(modal.touchTimer).equal(null);
    });

    it('should honor `isMobile` option and add class to HTML tag', function () {
      new SuperModal($('#the-modal')[0]);
      expect($('html').hasClass('supermodal-not-mobile')).equal(false);

      new SuperModal($('#the-modal')[0], {isMobile: false});
      expect($('html').hasClass('supermodal-not-mobile')).equal(true);
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

      var sandbox = sinon.sandbox.create();

      sandbox.stub(EventHelper, 'listen', function(el, eventName, cb) {
        var args = argsArr.shift();
        expect(el).equal(args[0]);
        expect(eventName).equal(args[1]);
      });

      var modal = new SuperModal($('#the-modal')[0], {isMobile: true});

      expect(argsArr.length).equal(0);

      sandbox.restore();
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
        expect(modal.touching).equal(false);
        expect(modal.touchTimer).equal(null);
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

      expect($('body').hasClass('supermodal-body-show')).equal(false);
      expect($('#the-modal').hasClass('supermodal-show')).equal(false);
      expect(modal.pageScrollTop).equal(undefined);

      modal.show();

      expect($('body').hasClass('supermodal-body-show')).equal(true);
      expect($('#the-modal').hasClass('supermodal-show')).equal(true);
      expect($('#the-modal').css('height')).match(/^\d+px$/); // TODO: more precise
      expect(modal.pageScrollTop).equal(0);
    });
  });

  describe('resetPageScrollTop', function () {
    it('should scroll page to modal open position', function () {
      // Couldn't really test it, yet.
    });
  });

  describe('hide', function () {
    it('should hide remove class names', function () {
      var modal = new SuperModal($('#the-modal')[0], {isMobile: true});
      modal.show();

      expect($('body').hasClass('supermodal-body-show')).equal(true);
      expect($('#the-modal').hasClass('supermodal-show')).equal(true);

      modal.hide();

      expect($('body').hasClass('supermodal-body-show')).equal(false);
      expect($('#the-modal').hasClass('supermodal-show')).equal(false);
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
      expect(modal.onHideCallbacks.length).equal(0);
      modal.onHide(function () {});
      modal.onHide(function () {});
      expect(modal.onHideCallbacks.length).equal(2);
    });
  });

  var doit = window.__env__['TRAVIS'] ? it.skip : it;
  doit('should close when backdrop clicked', function (done) {
    var modal = new SuperModal($('#the-modal')[0], {isMobile: true});
    modal.show();
    $('#the-modal .supermodal-backdrop').click();
    setTimeout(function () {
      expect($('#the-modal').hasClass('supermodal-show')).equal(false);
      done();
    }, 100);
  });

  it('should close when close button clicked', function () {
    var modal = new SuperModal($('#the-modal')[0], {isMobile: true});
    modal.show();
    $('#the-modal .supermodal-close').click();
    expect($('#the-modal').hasClass('supermodal-show')).equal(false);
  });
});
