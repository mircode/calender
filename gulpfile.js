/**
 * 
 * gulpfile.js
 * 
 * 采用Gulp构建项目
 * 
 * 作者: 魏国兴
 * 日期: 20160412
 * 
 * 组件安装
 * npm install gulp gulp-jshint gulp-minify-css gulp-uglify gulp-rename gulp-concat gulp-clean  gulp-html-replace --save-dev
 * 
 * 运行
 * gulp
 * 
 */

// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查(这里并没有使用校验模块,有待优化)
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
	htmlreplace = require('gulp-html-replace');//替换HTML中的路径
		
	// 样式处理
	gulp.task('css', function () {
	    var cssSrc = './css/*.css',
	        cssDst = './dist/css';
	
	    gulp.src(cssSrc)
	        .pipe(gulp.dest(cssDst))
	        .pipe(rename({ suffix: '.min' }))
	        .pipe(minifycss())
	        .pipe(gulp.dest(cssDst));
	});
	
	// 图片处理
	gulp.task('img', function(){
	    var imgSrc = './img/*',
	        imgDst = './dist/img';
	    gulp.src(imgSrc)
	        .pipe(gulp.dest(imgDst));
	})
	
	// js处理
	gulp.task('js', function () {
	    var jsSrc = './js/*.js',
	        jsDst ='./dist/js';
	
	    gulp.src(jsSrc)
	        .pipe(concat('calendar.js'))
	        .pipe(gulp.dest(jsDst))
	        .pipe(rename({ suffix: '.min' }))
	        .pipe(uglify())
	        .pipe(gulp.dest(jsDst));
	});
	// lib依赖库文件
	gulp.task('lib', function () {
	    var jsSrc = './lib/*.js',
	        jsDst ='./dist/lib';
	
	    gulp.src(jsSrc)
	        .pipe(gulp.dest(jsDst));
	});
	
	 // 替换html的路径
	gulp.task("html", function(){
		var htmlSrc = './*.html',
	        htmlDst ='./dist';
	        
	  	return gulp.src(htmlSrc)
	    	.pipe(htmlreplace({
	    		'reset':'css/reset.min.css',
	    		'css':'css/calendar.min.css',
		        'js': 'js/calendar.min.js'
	    	})).pipe(gulp.dest(htmlDst));
	    	
	});
	
	// 清空图片、样式、js
	gulp.task('clean', function() {
	    gulp.src(['./dist/*.html','./dist/css/*', './dist/lib/*','./dist/js/*','./dist/img/*'], {read: false})
	        .pipe(clean());
	});
	
	// 默认任务 清空图片、样式、js并重建 运行语句 gulp
	gulp.task('default', ['clean'], function(){
		// 延时500ms,清除目录有一定延时
		setTimeout(function(){
	    	gulp.start('html','css','lib','js','img');
	    },500);
	});
	
	// 监听任务 运行语句 gulp watch
	gulp.task('watch',function(){
	
	    server.listen(port, function(err){
	        if (err) {
	            return console.log(err);
	        }
	
	        // 监听css
	        gulp.watch('./css/*.css', function(){
	            gulp.run('css');
	        });
	        // 监听images
	        gulp.watch('./img/*', function(){
	            gulp.run('images');
	        });
	        // 监听js
	        gulp.watch('./js/*.js', function(){
	            gulp.run('js');
	        });
	        // 监听lib
	        gulp.watch('./lib/*.js', function(){
	            gulp.run('lib');
	        });
			// 监听html
	        gulp.watch('./*.html', function(){
	            gulp.run('html');
	        });
	    });
	});