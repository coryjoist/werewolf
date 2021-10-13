const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const del = require('del');
const minify = require('gulp-minify');
const data = require('gulp-data');
var fs = require('fs');
var path = require('path');

function clean() {
  return del('./dist/**/*');
}

function build() {
  return gulp.src('./src/pages/*.hbs')
    .pipe(data(function(file) {
      var dataFilePath = '.src/data/' + path.basename(file.stem) + '.json';
      return fs.existsSync(dataFilePath) ? JSON.parse(fs.readFileSync(dataFilePath)) : null;
    }))
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: ['./src/partials'],
      helpers: {
        ifEquals: function(arg1, arg2, options) {
          return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        toLowerCaseSquashed: function(str) {
          return str.toLowerCase().replace(/\s/g,'');
        }
      },
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./dist'));
}

function compress() {
  return gulp.src(['./src/assets/js/*.js'])
    .pipe(minify())
    .pipe(gulp.dest('./dist/js'))
}

function copyAssets() {
  return gulp.src('./src/assets/**/*')
    .pipe(gulp.dest('./dist'));
}

exports.clean = clean;
exports.default = gulp.series(clean, compress, gulp.parallel(build, copyAssets));
