// native modules
var path = require('path');

// gulp modules
var gulp = require('gulp');

// 3rd party modules
var requireDir = require('require-dir');

var runSequence = require('run-sequence');

module.exports = function(config) {
	// set up gulp helper functions
	gulp.mkdir = require('./util/mkdir');
	gulp.timer = require('./util/timer');
	gulp.logger = require('./util/logger');
	gulp.errorHandler = require('./util/error-handler');

	// set the gulp dir root
	gulp.dir = __dirname;

	// require ALL js files in the task directory recursively
	var obj = requireDir('./tasks', { recurse: true });

	// since all task files should return a function
	// that takes the gulp instance and the config as parameters,
	// all functions on the `obj` are called.
	for(var p in obj) {
		obj[p](gulp, config.gulp);
	}

	obj = requireDir('./bb-tasks', { recurse: true });

	for(p in obj) {
		obj[p](gulp, config);
	}

	for(p in config.gulp.tasks) {
		console.log(p);
		(function(p) {
			gulp.task(p, function(callback) {
				var tasks = config.gulp.tasks[p].slice(0);
				tasks.push(callback);
				runSequence.apply(null, tasks);
			});
		})(p);
	}
};
