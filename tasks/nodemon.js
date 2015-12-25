var p = require('path');
var fs = require('fs');

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

var TASK_NAME = 'nodemon';

var config = gulp.config({
	defaults:  _.merge(fs.existsSync(p.join(PWD, 'nodemon.json')) ? require(p.join(PWD, 'nodemon.json')) : {}, {
		script: fs.existsSync(p.join(PWD, 'package.json')) ? require(p.join(PWD, 'package.json')).main.replace(/^\./, PWD) : 'server/server.js',
		env: {
			EXTERNAL_PORT: 3000,// what port you actually put into the browser... when using browser-sync this will differ from the internal port used by express
			PWD: PWD,
			DEBUG_COLORS: true,// needed to force debug to use colors despite tty.istty(0) being false, which it is in a child process
			NODE_ENV: ENV,
			DEBUG: "epiphany:loaders"
		}
	})
}, gulp.userConfig[TASK_NAME]);


gulp.task(TASK_NAME, function(cb) {
	nodemon(_.defaults({ stdout: false }, config))
		.on('readable', function(data) {
			this.stdout.pipe(process.stdout);
			this.stderr.pipe(process.stderr);

			this.stdout.on('data', function(chunk) {
				if (/Express server started on port/.test(chunk)) {
					if(cb)
						cb();

					cb = null;

					if(browserSync.active)
						browserSync.reload();
				}
			});

		});
});
