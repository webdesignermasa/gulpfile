'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sassGlob = require('gulp-sass-glob');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

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
    .pipe(postcss([ autoprefixer() ]))
    .pipe(dest('dist/css'))
    .pipe(notify({
      message: 'Compiled Sass',
      onLast: true,
    }));
};

function jsTranspile() {
  return src('src/js/**/*.js')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(dest('dist/js'))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js',
    }))
    .pipe(dest('dist/js'));
}

function watchFiles() {
  watch('src/**/*.html', htmlCopy);
  watch('src/sass/**/*.scss', cssTranspile);
  watch('src/js/**/*.js', jsTranspile);
}

exports.cssTranspile = cssTranspile;
exports.default = watchFiles;