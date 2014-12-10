var gulp = require('gulp');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var yuidoc = require("gulp-yuidoc");
var changelog = require('conventional-changelog');
var assign = Object.assign || require('object.assign');
var pkg = require('./package.json');
var fs = require('fs');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

var VERSION = pkg.version;

var path = {
  source:'lib/**/*.js',
  output:'dist/',
  doc:'./doc'
};

var jshintConfig = {esnext:true};

gulp.task('clean', function() {
  return gulp.src([path.output], {read: false})
    .pipe(clean());
});

gulp.task('build-debug', function () {
  return gulp.src(path.source)
    .pipe(gulp.dest(path.output))
});

gulp.task('build-min', function () {
  return gulp.src(path.source)
    .pipe(uglify())
    .pipe(rename('HTMLTemplateElement.min.js'))
    .pipe(gulp.dest(path.output))
});

gulp.task('lint', function() {
  return gulp.src(path.source)
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter(stylish));
});

gulp.task('doc', function(){
  gulp.src(path.source)
    .pipe(yuidoc.parser(null, 'api.json'))
    .pipe(gulp.dest(path.doc));
});

gulp.task('changelog', function(callback) {
  changelog({
    repository: pkg.repository.url,
    version: VERSION,
    file: 'CHANGELOG.md'
  }, function(err, log) {
    fs.writeFileSync(path.doc + '/CHANGELOG.md', log);
  });
});

gulp.task('build', function(callback) {
  runSequence(
    'clean',
    ['build-min', 'build-debug'],
    callback
  );
});

gulp.task('prepare-release', function(callback){
  runSequence(
    'build',
    'lint',
    'doc',
    'changelog',
    callback
  );
});