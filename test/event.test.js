var EventHelper = require('../lib/event');

describe('EventHelper', function () {
  describe('listen', function () {
    beforeEach(function () {
      setFixtures(sandbox());
    });

    it('should attach event listener', function (done) {
      EventHelper.listen($j('#sandbox')[0], 'click', function () {
        done();
      });

      $j('#sandbox').click();
    });
  });
});
