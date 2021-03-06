
const mix = require('laravel-mix');
require('laravel-mix-polyfill');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.options({
  processCssUrls: false
})
  .js('./app/src/js/app.js', './app/public/js/app.js')
  .sass('./app/src/css/app.scss', './app/public/css/app.css', [])
  .polyfill({
    enabled: true,
    useBuiltIns: "usage",
    targets: "firefox 50, IE 11"
  });