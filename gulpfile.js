'use strict';

// Gulp・通知
const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

// CSS・Sass
const sassGlob = require('gulp-sass-glob');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// JavaScript
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// 画像削除
const del = require('del');

// 画像圧縮
const imagemin = require('gulp-imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

// ブラウザオートリロード
const browserSync = require('browser-sync').create();

// 基点となるフォルダ
const srcDir = 'src';
const destDir = 'dist';

// 各ファイルの格納フォルダ
const srcPath = {
  html:  srcDir + '/**/*.html',
  sass:  srcDir + '/sass/**/*.scss',
  js:    srcDir + '/js/**/*.js',
  img:   srcDir + '/img/**/*',
  fonts: srcDir + '/fonts/**/*',
};

const destPath = {
  html:  destDir,
  css:   destDir + '/css',
  js:    destDir + '/js',
  img:   destDir + '/img',
  fonts: destDir + '/fonts',
};

// HTMLをコピーする
function htmlCopy() {
  return src(srcPath.html)
    .pipe(dest(destPath.html))
    .pipe(notify({
      message: 'Copied HTML',
      onLast: true,
    }));
}

// Sassをコンパイルする
function cssTranspile() {
  return src(srcPath.sass)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(dest(destPath.css))
    .pipe(notify({
      message: 'Compiled Sass',
      onLast: true,
    }));
};

// JavaScriptをコンパイル＆圧縮（難読化）する
function jsTranspile() {
  return src(srcPath.js)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(dest(destPath.js))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js',
    }))
    .pipe(dest(destPath.js))
    .pipe(notify({
      message: 'Compiled JavaScript',
      onLast: true,
    }));
}

// 画像を削除する
function imageClean() {
  return del([destPath.img])
    .pipe(notify({
      message: 'Deleted Images',
      onLast: true,
    }));
}

// 画像を圧縮する
function imageCompress() {
  return src(srcPath.img, { since: lastRun(imageCompress) })
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
    .pipe(dest(destPath.img))
    .pipe(notify({
      message: 'Compressed Images',
      onLast: true,
    }));
}

// フォントをコピーする
function fontCopy() {
  return src(srcPath.fonts)
    .pipe(dest(destPath.fonts))
    .pipe(notify({
      message: 'Copied Fonts',
      onLast: true,
    }));
}

// ブラウザのオートリロードを初期化する
function browserSyncInit() {
  browserSync.init({
    server: {
      baseDir: destDir,
    },
  });
}

// ブラウザをオートリロードする
function browserSyncReload(callback) {
  browserSync.reload();
  callback();
}

// ファイルの変更を監視する
function watchFiles() {
  watch(srcPath.html,  series(htmlCopy, browserSyncReload));
  watch(srcPath.sass,  series(cssTranspile, browserSyncReload));
  watch(srcPath.js,    series(jsTranspile, browserSyncReload));
  watch(srcPath.img,   series(imageCompress, browserSyncReload));
  watch(srcPath.fonts, series(fontCopy, browserSyncReload));
}

// Gulpタスク
exports.html = htmlCopy;
exports.css = cssTranspile;
exports.js = jsTranspile;
exports.img = imageCompress;
exports.font = fontCopy;
exports.imgAll = series(
  imageClean, imageCompress
);
exports.build = series(
  htmlCopy, cssTranspile, jsTranspile, imageCompress, fontCopy
);
exports.watch = watchFiles;
exports.default = series(
  htmlCopy, cssTranspile, jsTranspile, imageCompress, fontCopy,
  parallel(browserSyncInit, watchFiles)
);