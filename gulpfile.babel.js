// generated on 2015-09-25 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';
const $ = gulpLoadPlugins();
const reload = browserSync.reload;
import imagemin from 'gulp-imagemin';
import merge from 'merge-stream';
import spritesmith from 'gulp.spritesmith';
import pngquant from 'imagemin-pngquant';
import rupture from 'rupture';
import jeet from 'jeet';
import svgSymbols from 'gulp-svg-symbols';
import combineMq from 'gulp-combine-mq';
import uncss from 'gulp-uncss';

gulp.task('styles', function () {
  gulp.src('app/stylus/main.styl')
    .pipe($.stylus({
      use: [rupture(), jeet()]
    }))
    .pipe(combineMq({
        beautify: true
    }))
   .pipe(uncss({
        html: ['app/index.html'],
        timeout: 3000,
        ignore:['.header__in_transformed', '.slide_state_visible', '.testimonials__control_active', '.header__hamb_active', '.overlay_active', '.header_no-fixed', '.header__nav_active', /header__nav_active/]
    }))
   .pipe($.minifyCss())
   .pipe(gulp.dest('app/css'))
   .pipe(gulp.dest('dist/css'));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint('app/scripts/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('html', ['styles'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}],
      use: [pngquant()]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*',
    'app/stylus/**/*'
  ]).on('change', reload);

  gulp.watch('app/stylus/**/*.styl', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/stylus/*.styl')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});


gulp.task('sprites', () => {
  var spriteData = gulp.src('app/images/*.png').pipe(spritesmith({
   imgName: 'sprites.png',
   cssName: 'sprites.styl',
   imgPath:'../images/sprites/sprites.png'
 }));

 // Pipe image stream through image optimizer and onto disk
 var imgStream = spriteData.img
   .pipe(imagemin())
   .pipe(gulp.dest('app/images/sprites/'));

 // Pipe CSS stream through CSS optimizer and onto disk
 var cssStream = spriteData.css
  // .pipe(csso())
   .pipe(gulp.dest('app/stylus/helpers/'));

 // Return a merged stream to handle both `end` events
 return merge(imgStream, cssStream);
});

gulp.task('icons', function () {
  return gulp.src('app/images/*.svg')
    .pipe(svgSymbols({
    svgId:      'icon-%f',
    className:  '.icon-%f',
    title:      false,
    fontSize:   16,
    svgoConfig: {

    }
    //templates: ['default-svg', 'default-demo', 'customCSSTemplate']
  }))
    .pipe(gulp.dest('app/images/sprites/'))
    .pipe(gulp.dest('dist/images/sprites/')); 
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras', 'sprites', 'icons'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}))
  .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
