'use strict';

var browsers = process.env.TRAVIS ? ['PhantomJS'] : ['Chrome', 'Firefox', 'Safari'];

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine-jquery', 'browserify', 'jasmine'],
    files: [
      'test/test-setup.js',
      'test/supermodal-fixture.html',
      'test/**/*.js'
    ],
    exclude: [],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: browsers,
    singleRun: false
  });
};
