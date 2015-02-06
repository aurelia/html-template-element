var gulp = require('gulp');
var runSequence = require('run-sequence');
var paths = require('../paths');
var assign = Object.assign || require('object.assign');
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

gulp.task('build-debug', function () {
  return gulp.src(paths.source)
    .pipe(gulp.dest(paths.output))
});

gulp.task('build-min', function () {
  return gulp.src(paths.source)
    .pipe(uglify())
    .pipe(rename('HTMLTemplateElement.min.js'))
    .pipe(gulp.dest(paths.output))
});

gulp.task('build', function(callback) {
  runSequence(
    'clean',
    ['build-min', 'build-debug'],
    callback
  );
});
