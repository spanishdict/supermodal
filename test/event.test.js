var $ = require('jquery');
var EventHelper = require('../lib/event');

describe('EventHelper', function () {
  describe('listen', function () {
    beforeEach(function () {
      setFixtures('<div id="sandbox"></div>');
    });

    afterEach(function () {
      cleanFixtures();
    });

    var doit = window.__env__['TRAVIS'] ? it.skip : it;
    doit('should attach event listener', function (done) {
      EventHelper.listen($('#sandbox')[0], 'click', function () {
        done();
      });

      $('#sandbox').click();
    });
  });
});
