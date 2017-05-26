var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var plumberNotifier = require('gulp-plumber-notifier')
var clean = require('gulp-clean');
var pkg = require('./package.json');

 
gulp.task('clean', function () {
    return gulp.src(['./_site/static/*','_site/images/*'], {read: false})
        .pipe(plumberNotifier())
        .pipe(clean());
});

gulp.task('copy-static', function() {
    return gulp.src(['./_static/**']).pipe(gulp.dest('./_site/static'));
})

gulp.task('copy-images', function() {
    return gulp.src(['./_images/**']).pipe(gulp.dest('./_site/images'));
})

gulp.task('copy-js', function() {
    return gulp.src(['./_static/js/*.js'])
        .pipe(gulp.dest('./_site/static/js'));
})

// SASS to css
gulp.task('sass', function(){
    return gulp.src([
            './_sass/style.scss',
            './_sass/shortcodes/shortcodes.scss',
            './_sass/default-theme.scss',
            './_sass/red-theme.scss',
            './_sass/green-theme.scss'])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest("./_site/static/css"));
});

gulp.task("minify-js", function() {
     return gulp.src("./_static/js/scripts.js")
        .pipe(plumberNotifier())
        .pipe(uglify())
        .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest("./_site/static/js/"));

});

gulp.task("html-prettify", function() {
    return gulp.src('./*.html')
        .pipe(prettify({indent_char: " ", indent_size: 2}))
        .pipe(gulp.dest("./"));
});

gulp.task("minify-css", ['sass'], function() {
    return gulp.src([
        './_site/static/css/style.css',
        './_site/static/css/shortcodes.css',
        './_site/static/css/default-theme.css',
        './_site/static/css/red-theme.css',
        './_site/static/css/green-theme.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./_site/static/css"));
});

gulp.task('watch:sass', function () {
  gulp.watch(['./_sass/**/*.scss','./_sass/*.scss'], ['sass']);
});

gulp.task('watch:js', function () {
  gulp.watch("./_static/js/scripts.js", ['copy-js','minify-js']);
});


gulp.task('default', ['copy-images', 'copy-static', 'minify-js', 'minify-css', 'watch:sass', 'watch:js']);
gulp.task('setup', ['copy-images', 'copy-static', 'minify-js', 'minify-css']);