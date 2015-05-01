var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


module.exports = function(gulp, config) {
	function bower(src){
		function addFile(file, pkg) {
			files[newFilename] = path.join(src, pkg, file);
		}

		src = config.bower.src;

		var files = [];

		if(fs.existsSync(src)) {
			_.each(fs.readdirSync(src), function(pkg) {
				var jsonPath = path.join(src, pkg, '.bower.json');
				if(!fs.existsSync(jsonPath)) {
					jsonPath = path.normalize(path.join(jsonPath, '../bower.json'));
					if(!fs.existsSync(jsonPath)) jsonPath = null; }

				var main;
				if(jsonPath) {
					main = require(jsonPath).main;
				}

				if(typeof main === 'string') {
					files.push(path.join(src, pkg, main));
				} else if (main instanceof Array) {
					for(var j = 0; j < main.length; j++) {
						files.push(path.join(src, pkg, main[j]));
					}
				} else {
					var file = pkg + '.js';
					if(fs.existsSync(path.join(src, pkg, file))) files.push(path.join(src, pkg, file));
					else console.log('did not find a file for ' + pkg);
				}
			});

		}

		return files;
	}
	gulp.task('bower', function() {
		_.each(bower(), function(src, dest) {
			gulp.src(src).
				pipe(uglify()).pipe(rename(function(p){
					p.basename = _.difference(p.basename.split(/[-_\.]/), ['dist', 'src', 'min', 'js']).join('-');
				})).pipe(gulp.dest(config.bower.dest));
		});
	});
};
