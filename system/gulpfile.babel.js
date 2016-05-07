// gulp build --ENV -m PRODUCTION
// gulp build --ENV -m DEBUG
// gulp build --ENV -m DEBUG_LOCAL

import webpackConfig from './webpack.config';
import setting from './setting';

import gulp from 'gulp';
import rename from 'gulp-rename';
import swig from 'gulp-swig';
import webpack from 'gulp-webpack';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import mqpacker from 'css-mqpacker';
import csswring from 'csswring';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import using from 'gulp-using';
import cached from 'gulp-cached';
import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';
import minimist from 'minimist';
import path from 'path';

let BrowserSync = browserSync.create();
let env = minimist(process.argv.slice(2))

const SETTING = setting((function() {
  return env['m'] != null ? { mode: env['m'] } : null;
})());

const SUPPORT_BROWSERS = [
  'ie >= 8',
  'ie_mob >= 10',
  'ff >= 20',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 8',
  'android >= 4.0',
  'and_ff >= 20',
  'and_chr >= 34'
];


console.log('Builder End Setting | /system/gulp/setting.js');
console.log(`MODE: ${SETTING.MODE}`);
console.log(`HOST: ${SETTING.HOST} | PORT: ${SETTING.PORT}`);


/* ------------------------------ */
let plumberWithNotify = function() {
  return plumber({
    errorHandler: notify.onError("<%= error.message %>")
  });
};


for (let i = 0, len = SETTING.PAGES.length; i < len; i++) {
  let name = SETTING.PAGES[i].name;
  let dir = SETTING.PAGES[i].dir;

  /**
   * ------------------------------
   * HTML TEMPLATE
   * ------------------------------
   */
  gulp.task(`${name}TemplateEngine`, function() {
    let options = {
      data: SETTING,
      defaults: { cache: false }
    }

    gulp.src([`${SETTING.CORE}${SETTING.ENGINE}/${name}/index.${SETTING.ENGINE_ATTRIBUTE}.html`]).
      pipe(plumberWithNotify()).
      pipe(using()).
      // pipe(cached('swig')).
      pipe(swig(options)).
      pipe(rename(function(filePath) {
        filePath.basename = path.basename(filePath.basename, `.${SETTING.ENGINE_ATTRIBUTE}`);
      })).
      pipe(gulp.dest(`${SETTING.APPLICATION_DIST}${dir}`));
  });

  /**
   * ------------------------------
   * STYLE
   * ------------------------------
   */
  gulp.task(`${name}Style`, function() {
    gulp.src([`${SETTING.CORE}${SETTING.STYLE}/${name}/*.scss`]).
      pipe(plumberWithNotify()).
      pipe(using()).
      pipe(cached(`${name}Style`)).
      pipe(sass().on('error', sass.logError)).
      pipe(postcss([
        autoprefixer({
          browsers: SUPPORT_BROWSERS,
          cascade: true
        }),
        mqpacker,
        csswring
      ])).
      pipe(gulp.dest(`${SETTING.APPLICATION_DIST}${dir}/${SETTING.CSS}/`));
  });

  /**
   * ------------------------------
   * WEB PACK
   * ------------------------------
   */
  gulp.task(`${name}Webpack`, function(){
   gulp.src([
      `${SETTING.CORE}${SETTING.ALT_JS}/${name}/*.${SETTING.ALT_JS_ATTRIBUTE}`,
      `${SETTING.CORE}${SETTING.ALT_JS}/${name}/**/*.${SETTING.ALT_JS_ATTRIBUTE}`
    ]).
    pipe(plumberWithNotify()).
    pipe(using()).
    pipe(cached('webpack')).
    pipe(webpack(webpackConfig(name, SETTING))).
    pipe(gulp.dest(`${SETTING.APPLICATION_DIST}${dir}/${SETTING.JS}`));
  });



  /**
   * ------------------------------
   * File watching
   * ------------------------------
   */
  console.log(`========== ${name}: ${dir} ==========`);
  console.log(`[${SETTING.ENGINE}]\n  TARGET:\n    ${SETTING.CORE}${SETTING.ENGINE}/${name}/*.${SETTING.ENGINE_ATTRIBUTE}.html\n  TASK:\n    ${name}TemplateEngine`);
  console.log(`[${SETTING.STYLE}]\n  TARGET:\n    ${SETTING.CORE}${SETTING.STYLE}/${name}/*.scss\n  TASK:\n    ${name}Style`);
  console.log(`[webpack]\n  TARGET:\n    ${SETTING.CORE}${SETTING.ALT_JS}/${name}/*.coffee\n    ${SETTING.CORE}${SETTING.ALT_JS}/${name}/**/*.coffee\n    ${SETTING.CORE}${SETTING.ALT_JS}/${name}/*.babel.js\n    ${SETTING.CORE}${SETTING.ALT_JS}/${name}/**/*.babel.js\n  TASK:\n    ${name}Webpack`);
}



// gulp.task('watch', ['server'], function() {
gulp.task('watch', function() {
  for (let i = 0, len = SETTING.PAGES.length; i < len; i++) {
    let name = SETTING.PAGES[i].name;
    let dir = SETTING.PAGES[i].dir;

    gulp.watch(
      [`${SETTING.CORE}${SETTING.ENGINE}/${name}/*.${SETTING.ENGINE_ATTRIBUTE}.html`],
      [`${name}TemplateEngine`]
    );
    gulp.watch(`${SETTING.APPLICATION_DIST}${dir}*.html`).
      on('change', BrowserSync.reload)

    gulp.watch(
      [`${SETTING.CORE}${SETTING.STYLE}/${name}/*.scss`],
      [`${name}Style`]
    );
    gulp.watch(`${SETTING.APPLICATION_DIST}${dir}${SETTING.CSS}/*.css`).
      on('change', BrowserSync.reload)

    gulp.watch(
      [
        `${SETTING.CORE}${SETTING.ALT_JS}/${name}/*.coffee`,
        `${SETTING.CORE}${SETTING.ALT_JS}/${name}/**/*.coffee`,
        `${SETTING.CORE}${SETTING.ALT_JS}/${name}/*.babel.js`,
        `${SETTING.CORE}${SETTING.ALT_JS}/${name}/**/*.babel.js`
      ],
      [`${name}Webpack`]
    );
    gulp.watch(`${SETTING.APPLICATION_DIST}${dir}${SETTING.JS}/*.js`).
      on('change', BrowserSync.reload)
  }
});


gulp.task('default', ['watch']);


gulp.task('build', function() {
  for (let i = 0, len = SETTING.PAGES.length; i < len; i++) {
    let name = SETTING.PAGES[i].name;
    let dir = SETTING.PAGES[i].dir;

    runSequence(`${name}TemplateEngine`, `${name}Style`, `${name}Webpack`);
  }
});










