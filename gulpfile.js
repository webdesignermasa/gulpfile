'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));

function htmlCopy() {
  return src('src/**/*.html')
    .pipe(dest('dist'));
}

function cssTranspile() {
  return src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('dist/css'));
};

function watchFiles() {
  watch('src/**/*.html', htmlCopy);
  watch('src/sass/**/*.scss', cssTranspile);
}

exports.cssTranspile = cssTranspile;
exports.default = watchFiles;