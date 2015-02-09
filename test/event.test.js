var $ = require('jquery');
var EventHelper = require('../lib/event');

describe('EventHelper', function () {
  describe('listen', function () {
    beforeEach(function () {
      setFixtures(sandbox());
    });

    it('should attach event listener', function (done) {
      EventHelper.listen($('#sandbox')[0], 'click', function () {
        done();
      });

      $('#sandbox').click();
    });
  });
});