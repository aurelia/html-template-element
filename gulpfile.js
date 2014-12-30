var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var yuidoc = require("gulp-yuidoc");
var changelog = require('conventional-changelog');
var assign = Object.assign || require('object.assign');
var bump = require('gulp-bump');
var fs = require('fs');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var tools = require('aurelia-tools');

var path = {
  source:'src/**/*.js',
  output:'dist/',
  doc:'./doc'
};

var jshintConfig = {esnext:true};

gulp.task('clean', function() {
 return gulp.src([path.output])
    .pipe(vinylPaths(del));
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

gulp.task('doc-generate', function(){
  return gulp.src(path.source)
    .pipe(yuidoc.parser(null, 'api.json'))
    .pipe(gulp.dest(path.doc));
});

gulp.task('doc', ['doc-generate'], function(){
  tools.transformAPIModel(path.doc);
});

gulp.task('bump-version', function(){
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type:'patch'})) //major|minor|patch|prerelease
    .pipe(gulp.dest('./'));
});

gulp.task('changelog', function(callback) {
  var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

  return changelog({
    repository: pkg.repository.url,
    version: pkg.version,
    file: path.doc + '/CHANGELOG.md'
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
  return runSequence(
    'build',
    'lint',
    'bump-version',
    'doc',
    'changelog',
    callback
  );
});