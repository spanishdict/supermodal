var Util = require('../lib/util');

describe('Util', function () {
  describe('extend', function () {
    it('should extend objects (no deep)', function () {
      var result = Util.extend({}, {
        type: 'person',
        options: 'A'
      }, {
        options: 'B'
      });

      expect(result).eql({
        type: 'person',
        options: 'B'
      });
    });
  });

  describe('trim', function () {
    it('should remove leading and trailing white spaces', function () {
      var result = Util.trim('  hello world  \n');
      expect(result).eql('hello world');
    });
  });
});
