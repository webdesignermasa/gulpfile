'use strict';

const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sassGlob = require('gulp-sass-glob');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

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

function imageClean() {
  return del(['dist/img']);
}

function imageMinify() {
  return src('src/img/**/*', { since: lastRun(imageMinify) })
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(imagemin([
      imageminGifsicle({ optimizationLevel: 3 }),
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant(),
      imageminSvgo({
        plugins: [{
          name: 'removeViewBox',
					active: false,
        }]
      })
    ],
    {
      verbose: true
    }
    ))
    .pipe(dest('dist/img'));
}

function watchFiles() {
  watch('src/**/*.html', htmlCopy);
  watch('src/sass/**/*.scss', cssTranspile);
  watch('src/js/**/*.js', jsTranspile);
  watch('src/img/**/*', imageMinify);
}

exports.htmlCopy = htmlCopy;
exports.cssTranspile = cssTranspile;
exports.jsTranspile = jsTranspile;
exports.imagemin = series(imageClean, imageMinify);

exports.default = watchFiles;