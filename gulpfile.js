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
gulp.config = require('./config');

// set up gulp helper functions
gulp.mkdir = require('./util/mkdir');
gulp.timer = require('./util/timer');
gulp.logger = require('./util/logger');
gulp.errorHandler = require('./util/error-handler');

// gulp dir, should be the same as PWD
gulp.dir = __dirname;

var args = process.argv.slice(4);

(args.length > 0 ? args : _.flatten(gulp.config.tasks, true)).forEach(function(task) {
	require('./tasks/' + task);
});

// TCB-Gulp executable calls 'gulp --cwd [ path to tcb-gulp ], but gulp saves
// the initial CWD in INIT_CWD. In order for our node app to function properly,
// we set the CWD back to the directory in which tcb-glp was called
if(process.env.INIT_CWD) {
	process.chdir(process.env.INIT_CWD);
	gutil.log('Working directory changed (BACK) to' + chalk.magenta(process.cwd()));
}

// set up the 'default' task to use runSequence to run all tasks
gulp.task('default', function(callback) {
	runSequence.apply(null, gulp.config.tasks.concat(callback));
});
