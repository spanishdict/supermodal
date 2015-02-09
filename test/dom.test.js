var DOM = require('../lib/dom');

describe('DOM', function () {
  describe('addClass', function () {
    beforeEach(function () {
      setFixtures(sandbox());
    });

    it('should add class name to element', function () {
      var $sandbox = $j('#sandbox');

      DOM.addClass($sandbox[0], 'test1');
      expect($sandbox.attr('class')).toBe('test1');

      DOM.addClass($sandbox[0], 'test2');
      expect($sandbox.attr('class')).toBe('test1 test2');

      DOM.addClass($sandbox[0], 'test2');
      expect($sandbox.attr('class')).toBe('test1 test2');
    });
  });

  describe('removeClass', function () {
    beforeEach(function () {
      setFixtures(sandbox({class: 'test1'}));
    });

    it('should remove class name to element', function () {
      var $sandbox = $j('#sandbox');

      DOM.removeClass($sandbox[0], 'test2');
      expect($sandbox.attr('class')).toBe('test1');

      DOM.removeClass($sandbox[0], 'test1');
      expect($sandbox.attr('class')).toBe('');
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
      expect(DOM.getElementsByClassName('test1').length).toBe(3);
      expect(DOM.getElementsByClassName('test2').length).toBe(0);
    });

    it('should find all elements under a parent element', function () {
      expect(
        DOM.getElementsByClassName($j('#sandbox')[0], 'test1').length
      ).toBe(2);
    });
  });

  describe('getPageScrollTop', function () {
    it('should get page vertical scroll position', function () {
      expect(DOM.getPageScrollTop()).toBe($j(document).scrollTop());
    });
  });

  describe('getDocHeight', function () {
    it('should get page total height', function () {
      expect(DOM.getDocHeight()).toBe($j(document).height());
    });
  });
});
