'use strict';

var browsers = process.env.TRAVIS ? ['PhantomJS'] : ['Chrome', 'Firefox', 'Safari'];

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'mocha', 'expect', 'sinon'],
    files: [
      'test/test-setup.js',
      'test/supermodal-fixture.html',
      'test/**/*.js'
    ],
    exclude: [],
    preprocessors: {
      'test/supermodal-fixture.html': ['html2js'],
      'test/**/*.js': ['browserify', 'env']
    },
    envPreprocessor: ['TRAVIS'],
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: browsers,
    singleRun: false
  });
};
