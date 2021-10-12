const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const del = require('del');
const minify = require('gulp-minify');

function clean() {
  return del('./dist/**/*');
}

function build() {
  return gulp.src('./src/pages/*.hbs')
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: ['./src/partials'],
      helpers: {
        ifEquals: function(arg1, arg2, options) {
          return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
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
