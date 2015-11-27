var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var httpProxy = require('http-proxy');
var browserify = require('browserify');
var watchify = require('watchify');
var jstify = require('jstify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var minifyCss = require('gulp-minify-css');
var KarmaServer = require('karma').Server;
var reload = browserSync.reload;

// Bundle files with browserify
gulp.task('browserify', () => {
  // set up the browserify instance on a task basis
  var bundler = browserify({
    entries: 'app/js/main.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [jstify]
  });

  bundler = watchify(bundler);

  var rebundle = function() {
    return bundler.bundle()
      .on('error', $.util.log)
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .on('error', $.util.log)
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('.tmp/js'));
  };

  bundler.on('update', rebundle);

  return rebundle();
});

// Bundle files with browserify for production
gulp.task('browserify:dist', function () {
  // set up the browserify instance on a task basis
  var bundler = browserify({
    entries: 'app/js/main.js',
    // defining transforms here will avoid crashing your stream
    transform: [babelify, jstify]
  });

  return bundler.bundle()
    .on('error', $.util.log)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('html', function() {
  var assets = $.useref.assets();

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  gulp.src('app/images/*.{jpg,gif,svg,png}')
    .pipe($.imagemin())
    .pipe(gulp.dest('dist/images'));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
  return gulp.src([
    'app/{,styles/}fonts/**/*',
    'node_modules/bootstrap/dist/fonts/**/*'
  ])
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('express', () => {
  $.nodemon({
    script: 'server/index.js',
    ignore: ['app']
  });
});

gulp.task('test', callback => {
  var karma = new KarmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, callback);

  karma.start();
});

gulp.task('serve', ['browserify', 'express'], () => {
  var serverProxy = httpProxy.createProxyServer();

  browserSync({
    port: 9000,
    ui: {
      port: 9001
    },
    server: {
      baseDir: ['.tmp', 'app'],
      middleware: [
        function (req, res, next) {
          if (req.url.match(/^\/(api|avatar)\/.*/)) {
            serverProxy.web(req, res, {
              target: 'http://localhost:8000'
            });
          } else {
            next();
          }
        }
      ]
    }
  });

  gulp.watch([
    'app/*.html',
    'app/**/*.css',
    '.tmp/**/*.js'
  ]).on('change', reload);
});

gulp.task('serve:dist', ['browserify:dist', 'images', 'fonts', 'express'], () => {
  var serverProxy = httpProxy.createProxyServer();

  browserSync({
    port: 9000,
    ui: {
      port: 9001
    },
    server: {
      baseDir: 'dist',
      middleware: [
        function (req, res, next) {
          if (req.url.match(/^\/(api|avatar)\/.*/)) {
            serverProxy.web(req, res, {
              target: 'http://localhost:8000'
            });
          } else {
            next();
          }
        }
      ]
    }
  });
});

