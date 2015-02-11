// Use this file to provide an opportunity to run config code.

var $ = require('jquery');
var $el;

window.loadFixtures = function (key) {
  cleanFixtures();
  $el = $(__html__[key]);
  $('body').append($el);
};

window.setFixtures = function (html) {
  cleanFixtures();
  $el = $(html);
  $('body').append($el);
};

window.cleanFixtures = function () {
  if ($el) {
    $el.remove();
  }
};
