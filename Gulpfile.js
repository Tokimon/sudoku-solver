'use strict';

var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('demo:script', function() {
  browserify({ entries: './demo/src/demo.js' })
      .transform(babelify.configure({})) // ES6 -> ES5
      .bundle()
      .pipe(source('demo.js'))
      .pipe(buffer())
      .pipe(gulp.dest('./demo'));
});