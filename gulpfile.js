const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const bs = require('browser-sync').create();
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');

const files = {
    scssPath: "./scss/**/*.scss",
    jsPath: "./js/*.js",
}

function scssTask() {
    return(
        src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(dest("./css"))
        .pipe(bs.reload({ stream: true }))
    );
}

function reload() {
    bs.reload();
}

function jsTask() {
    return(
        src(files.jsPath)
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(rename('script.js'))
        .pipe(dest('dist'))
        .pipe(bs.reload({ stream: true }))
    );
}

function watchFiles() {
    bs.init({
        server: {
            baseDir: "./"
        }
    })
    watch('scss/**/*.scss', scssTask).on('change', reload)
    watch('./*.html').on('change', reload)
    watch('./js/*.js', jsTask).on('change', reload)
}



exports.default = parallel(watchFiles)