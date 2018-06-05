var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var pug = require('gulp-pug');
var gulpJade = require('gulp-jade');
var jade = require('jade');
var jsImport = require('gulp-js-import');
var gulpImports = require('gulp-imports');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('images', function () {
    gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('img/'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('templates', function () {
    gulp.src('./src/*.jade')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(gulpJade({
            jade: jade
        }))
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream({match: './build/*.html'}));
});


gulp.task('styles', function () {
    gulp.src('./src/*.sass')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(minifycss())
        // .pipe(concat('style.css'))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream({match: './build/style/*.css'}));
});

gulp.task('scripts', function () {
    return gulp.src('./src/*.js')
        .pipe(jsImport({hideConsole: true}))
        .pipe(gulpImports())
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))
        // .pipe(concat('script.js'))

        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
        // .pipe(browserSync.reload({ stream: true }))
});

gulp.task('default', function () {
    // gulp.watch("src/images/**/*", ['images']);
    gulp.watch("src/*.sass", ['styles']);
    gulp.watch("src/*.js", ['scripts']);
    gulp.watch("src/*.jade", ['templates']);
    gulp.watch(["/build/*.html", "/build/style/*.css"], ['bs-reload']);
});