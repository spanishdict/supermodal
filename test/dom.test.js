var $ = require('jquery');
var DOM = require('../lib/dom');

describe('DOM', function () {
  afterEach(function () {
    cleanFixtures();
  });

  describe('addClass', function () {
    beforeEach(function () {
      setFixtures('<div id="sandbox"></div>');
    });

    it('should add class name to element', function () {
      var $sandbox = $('#sandbox');

      DOM.addClass($sandbox[0], 'test1');
      expect($sandbox.attr('class')).eql('test1');

      DOM.addClass($sandbox[0], 'test2');
      expect($sandbox.attr('class')).eql('test1 test2');

      DOM.addClass($sandbox[0], 'test2');
      expect($sandbox.attr('class')).eql('test1 test2');
    });
  });

  describe('removeClass', function () {
    beforeEach(function () {
      setFixtures('<div id="sandbox" class="test1"></div>');
    });

    it('should remove class name to element', function () {
      var $sandbox = $('#sandbox');

      DOM.removeClass($sandbox[0], 'test2');
      expect($sandbox.attr('class')).eql('test1');

      DOM.removeClass($sandbox[0], 'test1');
      expect($sandbox.attr('class')).eql('');
    });
  });

  describe('getElementsByClassName', function () {
    beforeEach(function () {
      setFixtures('<div id="sandbox">' +
                    '<div class="test1"></div>' +
                    '<div class="test1"></div>' +
                 '</div>' +
                 '<div class="test1"></div>');
    });

    it('should find all elements on page', function () {
      expect(DOM.getElementsByClassName('test1').length).eql(3);
      expect(DOM.getElementsByClassName('test2').length).eql(0);
    });

    it('should find all elements under a parent element', function () {
      expect(
        DOM.getElementsByClassName($('#sandbox')[0], 'test1').length
      ).eql(2);
    });
  });

  describe('getPageScrollTop', function () {
    it('should get page vertical scroll position', function () {
      expect(DOM.getPageScrollTop()).eql($(document).scrollTop());
    });
  });

  describe('getDocHeight', function () {
    it('should get page total height', function () {
      expect(DOM.getDocHeight()).eql($(document).height());
    });
  });
});
