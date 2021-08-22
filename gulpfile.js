// MODULES
// var gulp = require('gulp');
// // var sass = require('gulp-sass');
// var js = require('gulp-uglify');
// var imagemin = require('gulp-imagemin');
// var browsersync = require('browser-sync');
// var reload = browsersync.reload;
// var plumber = require('gulp-plumber');
// // var gutil = require('gulp-util');
// var autoprefixer = require('gulp-autoprefixer');
// var sourcemaps = require('gulp-sourcemaps');
// var rename = require('gulp-rename');
// var concat = require('gulp-concat');
// var sass = require('gulp-sass');



// ERROR LOG
// var onError = function (err) {
//     console.log('An error occurred:', gutil.colors.magenta(err.message));
//     gutil.beep();
//     this.emit('end');
// };


// COMPILE AND MINIFY SASS
// gulp.task('sass', function () {
//     return gulp.src('src/scss/styles.scss')
//     .pipe(sourcemaps.init())
//     .pipe(sass({outputStyle: 'compressed'}))
//     // .pipe(sass.sync().on('error', sass.logError))
//     .pipe(sourcemaps.write())
//     .pipe(rename({
//         obj: 'main.min.css'
//     }))
//     .pipe(gulp.dest('dist/css'))
//     .pipe(browsersync.stream())
//     // done();
// });


// MINIFY JS
// gulp.task('js', function () {
//     return gulp.src('./wp-content/themes/pixelboutique/js/*.js')
//     .pipe(js())
//     .on('error', onError)
//     .pipe(rename({
//         suffix: '.min'
//     }))
//     .pipe(concat('all.min.js'))
//     .pipe(gulp.dest('./wp-content/themes/pixelboutique/js/min'))
//     .pipe(browsersync.stream())
//     done();
// });


// IMAGES
// gulp.task('imagemin', function () {
//     return gulp.src('./wp-content/themes/pixelboutique/images/*')
//     .pipe(imagemin())
//     .pipe(gulp.dest('./wp-content/themes/pixelboutique/images'))
//     done();
// });


// BROWSERSYNC
// gulp.task('browser-sync', function(done) {
//     browsersync.init({
//         proxy: 'http://localhost/testingsite/'
//     })
//     done();
// });

// RELOAD
// gulp.task('reload', function (done) {
//     browsersync.reload();
//     done();
// });


// WATCH
// gulp.task('watch', function() {
//     gulp.watch('./wp-content/themes/pixelboutique/sass/**/*.scss', gulp.series('sass', 'reload'));
//     gulp.watch('./wp-content/themes/pixelboutique/js/*.js', gulp.series('js', 'reload'));
//     gulp.watch('./wp-content/themes/pixelboutique/images/*', gulp.series('imagemin', 'reload'));

//     gulp.watch('./wp-content/themes/pixelboutique/**/*.php').on('change', browsersync.reload);
//     gulp.watch('*/pixelboutique/**/*.php').on('change', browsersync.reload);
// });


// gulp.task('default', gulp.series('sass'));
// exports.sass = sass;
// gulp.task('default', gulp.series('sass', 'js', 'imagemin', 'browser-sync', 'watch'));

// gulp.task('default', function () {
//     gulp.start('sass');
// });




'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var GulpUglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');




async function buildStyles() {

    return gulp.src('src/scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename("main.min.css"))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
};

async function vendor_styles() {

    return gulp.src('src/plugins/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
};

async function bootstrap_styles() {

    return gulp.src('src/bootstrap/bootstrap.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename("bootstrap.min.css"))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
};




async function scripts() {

    return gulp.src('src/js/**/*.js')
    .pipe(GulpUglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
};


async function vendor_scripts() {

    return gulp.src('src/plugins/**/*.js')
    .pipe(GulpUglify())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
};


async function compress_images() {

    return gulp.src('src/images/**/*.*')

 
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
      
    }))

    .pipe(imagemin([
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))

    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream());



};


async function watch() {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('src/scss/**/*.scss', buildStyles);
    gulp.watch('src/bootstrap/**/*.scss', bootstrap_styles);
    gulp.watch('src/images/**/*.*', compress_images);
    gulp.watch('src/plugins/**/*.css', vendor_styles);
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch('src/plugins/**/*.js', vendor_scripts);
    gulp.watch('./*.html').on('change', browserSync.reload);


};




exports.default = gulp.series(compress_images);
exports.default = gulp.parallel(buildStyles,vendor_styles);
exports.default = gulp.parallel(vendor_scripts,bootstrap_styles,watch,scripts);
exports.default = gulp.series(watch);



// exports.build = series(buildStyles, vendor_styles)
//      parallel(
//          css,

//           javascript
          
          
//           );



// exports.default = gulp.series
// (gulp.parallel(["buildStyles", "bootstrap_styles"]),
  
//       watch ,
//        scripts);

// exports.buildStyles = buildStyles;
// exports.bootstrap_styles = bootstrap_styles;

// exports.watch = function () {
//   gulp.watch('./sass/**/*.scss', ['sass']);
// };




// var imagemin = require('gulp-imagemin');
// var browsersync = require('browser-sync');
// var reload = browsersync.reload;
// var plumber = require('gulp-plumber');
// var autoprefixer = require('gulp-autoprefixer');
// var sourcemaps = require('gulp-sourcemaps');
// var rename = require('gulp-rename');
// var concat = require('gulp-concat');