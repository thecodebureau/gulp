// native modules
var path = require('path');
var fs = require('fs');
var stream = require('stream');

// 3rd party modules
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');

var uglify = require('gulp-uglify');

module.exports = function(gulp, config) {

	function piper (file) {
		var p = new stream.Writable();
		// all instances of Writable stream must have a _write function
		p._write = function(c,e,cb){cb();};
		p.on('pipe', function(src) {
			switch(ENV) {
				case 'development':
					src.on('error', gulp.errorHandler).pipe(fs.createWriteStream(path.join(config.dest, file)));
					break;
				case 'production':
					src
						.pipe(source(file))
						.pipe(buffer())
						.pipe(sourcemaps.init({loadMaps: true}))
						.pipe(uglify())
						.pipe(sourcemaps.write('./'))
						.pipe(gulp.dest(config.dest));
			}
		});
		return p;
	}

	config = config.browserify || config;

	if(typeof config.entries === 'string') config.entries = [ config.entries ];

	if(!config.outputs) config.outputs = config.entries.slice(0);
	else if(typeof config.outputs === 'string') config.outputs = [ config.outputs ];

	// used to keep track if directories have been created. factor-bundle fails if dest folder does not exist
	var initialized = false;

	var bundleFile, plugins = {};

	// needed for piper, see line 101
	config.originalOutputs = config.outputs;

	// make config entries absolute paths
	config.entries = config.entries.map(function(currentValue, index, arr) {
		return path.join(config.src, currentValue);
	});

	if(config.outputs.length > 1) {
		plugins.factorBundle = require('factor-bundle');

		bundleFile = 'common.js';
	} else {
		bundleFile = config.outputs[0];
	}

	gulp.task('browserify', function(callback) {
		if(!initialized) {
			gulp.mkdir(config.dest);
			if(config._require) {
				fs.createReadStream(path.join(gulp.dir, 'includes', 'require.js'))
					.pipe(fs.createWriteStream(path.join(config.dest, 'require.js')));
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
};
