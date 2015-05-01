// modules > 3rd party
var _ = require('lodash');
var requireDir = require('require-dir');

// modules > gulp
var gulp = require('gulp');
var runSequence = require('run-sequence');

global.ENV = process.env.NODE_ENV || 'development';
global.PWD = process.env.PWD;

module.exports = function(config) {
	if(!config) config = require(process.env.PWD + '/gulpconfig');
	// set up gulp helper functions

	// set the gulp dir root
	gulp.dir = __dirname;

	// require ALL js files in the task directory recursively
	var obj = requireDir('./tasks', { recurse: true });

	// since all task files should return a function
	// that takes the gulp instance and the config as parameters,
	// all functions on the `obj` are called.
	for(var p in obj) {
		obj[p](gulp, config);
	}

	_.each(config.tasks, function(subTasks, name) {
		gulp.task(name, function(callback) {
			var tasks = subTasks.slice(0);
			tasks.push(callback);
			runSequence.apply(null, tasks);
		});
	});
};
