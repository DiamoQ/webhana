const {src, dest, watch, parallel, series} = require('gulp'),
      scss        = require('gulp-sass')(require('sass')),
      concat      = require('gulp-concat'),
      uglify      = require('gulp-uglify-es').default,
      browserSync = require('browser-sync').create(),
      autoprefixer = require('gulp-autoprefixer'),
      clean       = require('gulp-clean'),
      avif       = require('gulp-avif'),
      webp       = require('gulp-webp'),
      newer       = require('gulp-newer'),
      svgSprite       = require("gulp-svg-sprite"), 
      fonter       = require("gulp-fonter"), 
      ttf2woff2       = require("gulp-ttf2woff2"), 
      include       = require("gulp-include"), 
      imagemin       = require('gulp-imagemin');


function pages() {
  return src("app/pages/*.html")
    .pipe(include({
      includePaths: "app/components"
    }))
    .pipe(dest('app'))
    .pipe(browserSync.stream())
}

function style() {
  return src('app/scss/style.scss')
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle : 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function script() {
  return src([
    'node_modules/swiper/swiper-bundle.js',
    'app/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/images/*.*',
    'app/images/*.svg',
    // 'app/images/sprite.svg',
    'app/fonts/fonts/*.*',
    'app/js/main.min.js',
    'app/**/*.html'
  ], {base : 'app'})
    .pipe(dest('dist'))
}

function cleanDist() {
  return src('dist') 
    .pipe(clean())
}

function process() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
  watch(['app/scss/style.scss'], style)
  watch(['app/images/src'], images)
  watch(['app/js/main.js'], script)
  watch(['app/components/*' , 'app/pages/*'], pages)
  watch(['app/*.html']).on('change', browserSync.reload)
}

function fonts() {
  return src('app/fonts/src/*.*')
    .pipe(fonter({
      formats: ["woff", "ttf"]
    }))
    .pipe(src("app/fonts/*.ttf"))
    .pipe(ttf2woff2())
    .pipe(dest("app/fonts/fonts"))
}

// function images() {
//   return src(["app/images/src/*.*", "!app/images/src/*.svg"])
//     .pipe(newer("app/images/dist"))
//     .pipe(avif({quality: 50}))

//     .pipe(src("app/images/src/*.*"))
//     .pipe(newer("app/images/dist"))
//     .pipe(webp())

//     .pipe(src("app/images/src/*.*"))
//     .pipe(newer("app/images"))
//     .pipe(imagemin())

//     .pipe(dest("app/images"))
// }

function images() {
  return src('src/images/*.*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(dest('dist/images'))
};

function sprite() {
  return src("app/images/*.svg")
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg",
          example: true
        }
      }
    }))
    .pipe(dest("app/images"))
}

exports.building = building;
exports.style = style;
exports.script = script;
exports.process = process;
exports.images = images;
exports.sprite = sprite;
exports.fonts = fonts;
exports.pages = pages;


exports.build = series(cleanDist, building, images);
exports.default = parallel(style, fonts, script, images, pages, process);

