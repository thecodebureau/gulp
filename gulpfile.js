// modules > native
var p = require('path');

// modules > 3rd party
var _ = require('lodash');
var chalk = require('chalk');

// modules > gulp
var gulp = require('gulp');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');

global._ = require('lodash');
global.ENV = process.env.NODE_ENV || 'development';
global.PWD = process.env.PWD;

// gulp config
var config = gulp.config = require('./config');

// set up gulp helper functions
gulp.mkdir = require('./util/mkdir');
gulp.timer = require('./util/timer');
gulp.logger = require('./util/logger');
gulp.errorHandler = require('./util/error-handler');

// gulp dir, should be the same as PWD
gulp.dir = __dirname;

var args = process.argv.slice(4);

var tasks = args.length > 0 ? args : _.flatten(config.tasks, true);

_.difference(tasks, config.localTasks).forEach(function(task) {
	require('./tasks/' + task);
});

// TCB-Gulp executable calls 'gulp --cwd [ path to tcb-gulp ], which makes gulp
// call `process.cwd()`. Gulp saves the initial CWD in INIT_CWD. In order for
// our node app to function properly, we set the CWD back to the directory in
// which tcb-glp was called
process.env.GULP_CWD = process.cwd();

if(process.env.INIT_CWD) {
	process.chdir(process.env.INIT_CWD);

	if(config.localTasks) {
		var path = config.localPath || './gulp-tasks';

		if(/\.js/.test(path))
			require(/^\//.test(path) ? path : p.join(PWD, path));
		else
			_.union(tasks, config.localTasks).forEach(function(task) {
				require(p.join(path, task));
			});
	}

	gutil.log('Working directory changed (BACK) to ' + chalk.magenta(process.cwd()));
}

// set up the 'default' task to use runSequence to run all tasks
gulp.task('default', function(callback) {
	runSequence.apply(null, config.tasks.concat(callback));
});
