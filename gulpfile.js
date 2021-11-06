'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sassGlob = require('gulp-sass-glob');
const sass = require('gulp-sass')(require('sass'));

function htmlCopy() {
  return src('src/**/*.html')
    .pipe(dest('dist'));
}

function cssTranspile() {
  return src('src/sass/**/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(sassGlob())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(dest('dist/css'))
    .pipe(notify({
      message: 'Compiled Sass',
      onLast: true,
    }));
};

function watchFiles() {
  watch('src/**/*.html', htmlCopy);
  watch('src/sass/**/*.scss', cssTranspile);
}

exports.cssTranspile = cssTranspile;
exports.default = watchFiles;