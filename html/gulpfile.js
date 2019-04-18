var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

var gulp_src = gulp.src;
gulp.src = function () {
  return gulp_src.apply(gulp, arguments)
  .pipe(plumber(function (error) {
    gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
    this.emit('end');
  })
  );
};

gulp.task('sass', function(){
  return gulp.src('scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./'))
    // .pipe(rename({ suffix: '.min' }))
    // .pipe(cssnano())
    // .pipe(gulp.dest('scss'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '.'
    },
    cors: true,
  })
})

gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch('scss/base/*.scss', ['sass']);
    gulp.watch('scss/pages/*.scss', ['sass']);
    gulp.watch('scss/utils/*.scss', ['sass']);
    gulp.watch('*.html', browserSync.reload);
    // Other watchers
});