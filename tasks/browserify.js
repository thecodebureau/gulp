// native modules
var p = require('path');
var fs = require('fs');
var stream = require('stream');

// 3rd party modules
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var chalk = require('chalk');

var gulp = require('gulp');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var config = gulp.config.browserify;

function piper (file) {
	var w = new stream.Writable();
	// all instances of Writable stream must have a _write function
	w._write = function(c,e,cb){cb();};
	w.on('pipe', function(src) {
		switch(ENV) {
			case 'development':
				src.on('error', function formatError(err) {
					err.task = 'browserify';

					var matchFileName = err.message.match(/\/[^\s:]*/);

					if(matchFileName) {
						var fileName = matchFileName[0];
						if(fileName.indexOf(PWD) > -1)
							fileName = './' + p.relative(PWD, fileName);

						fileName = chalk.yellow(fileName);

						var matchNumbers = err.message.match(/ \((.*)\)/);

						if(matchNumbers) {
							var arr = matchNumbers[1].split(':');

							err.message = err.message.slice(0, matchNumbers.index) + ' at line ' + arr[0] + ', col ' + arr[1];
						}

						err.message = err.message.split(matchFileName[0]).join(fileName);
					}

					err.message = err.message.split(/:\s*/).join('\n');

					gulp.errorHandler.call(this, err);
				}).pipe(fs.createWriteStream(p.join(config.dest, file)));
				break;
			case 'production':
				src
					.pipe(source(file))
					.pipe(buffer())
					.pipe(sourcemaps.init({loadMaps: true}))
					.pipe(uglify())
					.pipe(rename({ suffix: suffix }))
					.pipe(sourcemaps.write('./'))
					.pipe(gulp.dest(config.dest));
		}
	});
	return w;
}


if(typeof config.entries === 'string') config.entries = [ config.entries ];

if(!config.outputs) config.outputs = config.entries.slice(0);
else if(typeof config.outputs === 'string') config.outputs = [ config.outputs ];

// used to keep track if directories have been created. factor-bundle fails if dest folder does not exist
var initialized = false;

var bundleFile, plugins = {};

// needed for piper
config.originalOutputs = config.outputs;

// make config entries absolute paths
config.entries = config.entries.map(function(currentValue, index, arr) {
	return p.join(config.src, currentValue);
});

if(config.outputs.length > 1) {
	plugins.factorBundle = require('factor-bundle');

	bundleFile = 'common.js';
} else {
	bundleFile = config.outputs[0];
}

var suffix = ENV === 'production' ? '-' + Date.now().toString(16) : '';

gulp.task('browserify', function(callback) {

	if(!initialized) {
		gulp.mkdir(config.dest);

		fs.writeFile(config.dest + '.json', JSON.stringify({ suffix: suffix }));

		if(config._require) {
			fs.createReadStream(p.join(gulp.dir, 'includes', 'require.js'))
				.pipe(fs.createWriteStream(p.join(config.dest, 'require.js')));
		}
		initialized = true;
	}

	if(config.outputs.length > 1) {
		config.outputs = config.originalOutputs.map(function(currentValue, index, arr) {
			return piper(currentValue);
		});
	}

	var b = browserify(config);
	
	for(var p in plugins) {
		b.plugin(plugins[p], config);
	}

	return b.bundle()
		.pipe(piper(bundleFile));
});
