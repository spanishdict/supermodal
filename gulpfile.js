'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');

gulp.task('scss', function () {
  return gulp.src('./scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist'));
});

gulp.task('browserify', function () {
  var bundler = browserify({
    entries: ['./supermodal.js'],
    debug: false
  });

  bundler.require('./supermodal.js', {expose: 'supermodal'});

  return bundler
    .bundle()
    .pipe(source('supermodal.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist'))
    .on('error', function () {
      console.error('ERROR: ', arguments);
    });
});

gulp.task('html', function () {
  return gulp.src('demo/index.html').pipe(gulp.dest('dist'));
});

gulp.task('dist', ['browserify', 'scss', 'html']);

gulp.task('serve', ['dist'], function () {
  browserSync({
    ghostMode: {
      clicks: false,
      form: false,
      scroll: false
    },
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });

  var reload = browserSync.reload;

  gulp.watch('demo/index.html', ['html', reload]);
  gulp.watch('scss/*.scss', ['scss', reload]);
  gulp.watch('supermodal.js', ['browserify', reload]);
});
