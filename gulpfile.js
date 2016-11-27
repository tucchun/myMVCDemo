var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    uglify       = require('gulp-uglify'),
    watchPath    = require('gulp-watch-path'),
    combiner     = require('stream-combiner2'),
    sourcemaps   = require('gulp-sourcemaps'),
    minifycss    = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin     = require('gulp-imagemin'),
    minifyhtml   = require('gulp-minify-html'),
    jshint       = require('gulp-jshint'),
    concat       = require('gulp-concat'),
    rjsOptimize  = require('gulp-requirejs-optimize'),
    base64       = require('gulp-base64'),
    cssSpriter   = require('gulp-css-spriter'),
    cssimport    = require("gulp-cssimport");

var src         = 'src/',
    dist        = 'dist/',
    jsSrc       = 'src/**/*.js',
    jsDist      = 'dist/',
    cssSrc      = 'src/**/*.css',
    cssDist     = 'dist/',
    htmlSrc     = 'src/**/*.html',
    htmlDist    = 'dist/',
    imageSrc    = 'src/**/images/**',
    imageDist   = 'dist/',
    jsonSrc     = 'src/**/*.json',
    jsonDist    = 'dist/';

// js
var handleError = function (err) {
    'use strict';
    var colors = gutil.colors;
    console.log('\n');


    gutil.log(colors.red('Error!'));
    gutil.log('fileName: ' + colors.red(err.fileName));
    gutil.log('lineNumber: ' + colors.red(err.lineNumber));
    gutil.log('message: ' + colors.red(err.message));
    gutil.log('plugin: ' + colors.yellow(err.plugin));

};

/**
 * 压缩js
 */
gulp.task('uglifyjs', function () {
    'use strict';
    var combined = combiner.obj([
        gulp.src([jsSrc, '!src/app/*/main.js']),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write('./'),
        gulp.dest(jsDist)
    ]);
    combined.on('error', handleError);
    //gulp.src(jsSrc)
    //    .pipe(sourcemaps.init())
    //    .pipe(uglify())
    //    .pipe(sourcemaps.write("./"))
    //    .pipe(gulp.dest(jsDist));

});
/**
 * 压缩css
 */
var timestamp = +new Date();
gulp.task('minifycss', function(){
    'use strict';
    var combined = combiner.obj([
        gulp.src("src/**/style.css"),
        //cssimport(),
        //// sourcemaps.init(),
        //cssSpriter({
        //    // 生成的spriter的位置
        //    'spriteSheet':  './dist/init/commStyle/images/sprite_'+timestamp+'.png',
        //    // 生成样式文件图片引用地址的路径
        //    // 如下将生产：backgound:url(../images/sprite20324232.png)
        //    'pathToSpriteSheetFromCSS': '../../../init/commStyle/images/sprite_'+timestamp+'.png'
        //}),
        autoprefixer({
            browsers: 'last 2 versions'
        }),
        minifycss(),
        //base64(),
        // sourcemaps.write('./'),
        gulp.dest(cssDist)
    ]);
    combined.on('error', handleError);
    //gulp.src(cssSrc)
    //    .pipe(sourcemaps.init())
    //    .pipe(autoprefixer({
    //        browsers: 'last 2 versions'
    //    }))
    //    .pipe(minifycss())
    //    .pipe(sourcemaps.write('./'))
    //    .pipe(gulp.dest(cssDist));
});

/**
 * 压缩image
 */
gulp.task('image', function(){
    'use strict';
    var combined = combiner.obj([
        gulp.src(imageSrc),
        imagemin({
            progressive: true
        }),
        gulp.dest(imageDist)
    ]);
    combined.on('error', handleError);

     //gulp.src(imageSrc)
     //   .pipe(imagemin({
     //       progressive: true
     //   }))
     //   .pipe(gulp.dest(imageDist));
});
/**
 * 复制app内的json文件到dist目录
 */
gulp.task('copyjson', function(){
    gulp.src(jsonSrc)
        .pipe(gulp.dest(jsonDist));
});
/**
 * 压缩html
 */
gulp.task('minifyhtml', function () {
    gulp.src(htmlSrc)
        .pipe(minifyhtml())
        .pipe(gulp.dest(htmlDist));
});


// requirejs 优化
gulp.task("opt", function(){
    gulp.src(["src/app/demo/main.js"])
        //.pipe(sourcemaps.init())
        .pipe(rjsOptimize({
            mainConfigFile: [__dirname + "/src/main.js", __dirname + "/src/app/demo/main.js"]
        }))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/app/demo/'));
});


/**
 * js代码检测
 */
gulp.task('jshint', function () {
    gulp.src(jsSrc)
        .pipe(jshint())
        .pipe(jshint.reporter());
});

//watchjs
gulp.task('watchjs', function () {
    'use strict';
    gulp.watch(jsSrc, function (event) {
        var paths = watchPath(event, src, dist);
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            uglify(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ]);
        combined.on('error', handleError);
    });
});
//watchcss
gulp.task('watchcss', function(){
    gulp.watch(cssSrc, function(event){
        var paths = watchPath(event, src, dist);

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browsers: 'last 2 versions'
            }))
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir));
    });
});
//wtchimage
gulp.task('watchimage', function(){
    gulp.watch(imageSrc, function(event){
        var paths = watchPath(event, src, dist);
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distDir));
    });
});
//watchcopy
gulp.task('watchcopyjson', function(){
    gulp.watch([jsonSrc], function(event){
        var paths = watchPath(event, src, dist);

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(gulp.dest(paths.distDir));
    });
});
//watchhtml
gulp.task('watchhtml', function(){
    gulp.watch(htmlSrc, function(event){
        var paths = watchPath(event, src, dist);

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(minifyhtml())
            .pipe(gulp.dest(paths.distDir));
    });
});


//gulp.task('auto', ['watchjs', 'watchcss', 'watchimage', 'watchcopy']);
//gulp.task('build', ['uglifyjs','minifycss', 'minifyhtml', 'image', 'copy']);

gulp.task('auto', ['watchjs', 'watchcopyjson', 'watchcss', 'watchhtml', 'watchimage']);
gulp.task('build', ['uglifyjs', 'copyjson', 'minifycss', 'minifyhtml']);
//gulp.task('build', ['copy']);

gulp.task('default', ['build','opt'/*, 'auto'*/]);
