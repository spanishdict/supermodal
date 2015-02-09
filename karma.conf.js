'use strict';

var browsers = process.env.TRAVIS ? ['PhantomJS'] : ['Chrome', 'Firefox', 'Safari'];

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'dist/supermodal.js',
      'test/**/*.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: browsers,
    singleRun: false
  });
};
