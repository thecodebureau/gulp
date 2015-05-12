var path = require('path');
var _ = require('lodash');
var through = require('through2');
var gutil = require('gulp-util');
var nodeSass = require('node-sass');
var PluginError = gutil.PluginError;
var ext = gutil.replaceExtension;

// consts
const PLUGIN_NAME = 'tcb-sass';

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

// plugin level function (dealing with files)
function tcbSass(options) {

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
		var dir = path.dirname(file.path);
    if (path.basename(file.path).indexOf('_') === 0) {
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
      return cb();
    }

		var opts = options ? _.clone(options) : {};

		opts.includePaths = [
			process.env.PWD + "/node_modules/tcb-spysass/sass",
		];


		if(opts.includePaths[0] !== dir)
			opts.includePaths.unshift(dir);


    if (file.isBuffer()) {
			opts.data = file.contents.toString();

			nodeSass.render(opts, function(err, result) {
				if(err) {
					this.emit('error', new PluginError(PLUGIN_NAME, err));
					return cb();
				}

				file.path = ext(file.path, '.css');
				file.contents = new Buffer(result.css);


				this.push(file);

				cb(null, file);
			}.bind(this));
    }

    // make sure the file goes through the next gulp plugin
    this.push(file);
    // tell the stream engine that we are done with this file
  });

  // returning the file stream
  return stream;
}

// exporting the plugin main function
module.exports = tcbSass;
