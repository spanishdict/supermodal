'use strict';

var TRIM_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

module.exports = {
  extend: function (out) {
    out = out || {};
    var i, key;
    for (i = 1; i < arguments.length; i++) {
      if (arguments[i]) {
        for (key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) {
            out[key] = arguments[i][key];
          }
        }
      }
    }
    return out;
  },
  trim: function (str) {
    return str.replace(TRIM_REGEX, '');
  }
};
