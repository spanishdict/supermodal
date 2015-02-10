var $ = require('jquery');
var EventHelper = require('../lib/event');
console.log('DEBUG: ' + 'process.env.TRAVIS', process.env.TRAVIS);

describe('EventHelper', function () {
  describe('listen', function () {
    beforeEach(function () {
      setFixtures('<div id="sandbox"></div>');
    });

    afterEach(function () {
      cleanFixtures();
    });

    it.skip('should attach event listener', function (done) {
      EventHelper.listen($('#sandbox')[0], 'click', function () {
        done();
      });

      $('#sandbox').click();
    });
  });
});
