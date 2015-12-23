var fs = require('fs');

var gulp = require('gulp');
var gutil = require('gulp-util');
var rimraf = require('rimraf');

var dir = gulp.directories;

var TASK_NAME = 'wipe';

var config = gulp.config({
	src: [ dir.dest.root ]
}, gulp.userConfig[TASK_NAME]);

gulp.task(TASK_NAME, function(cb) {
	var count = 0;
	config.src.forEach(function(folder) {
		fs.exists(folder, function(exists) {
			if(exists) {
				rimraf(folder, function(err){
					if(err) throw err;
					gutil.log('Folder \033[35m' + folder + '\033[0m removed');
					count++;
					if(count >= config.src.length) {
						cb();
					}
				});
			} else {
				count++;
				if(count >= config.src.length) {
					cb();
				}
			}
		});
	});
});
