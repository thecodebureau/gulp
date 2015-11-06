// modules > native
var p = require('path');
var fs = require('fs');

// modules > gulp
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

function bower(dir){
	var files = [];

	if(fs.existsSync(dir)) {
		_.each(fs.readdirSync(dir), function(pkg) {
			// first try to determine where bower.json is
			var paths = [
				p.join(dir, pkg, '.bower.json'),
				p.join(dir, pkg, 'bower.json'),
			];
			
			var path;

			for(var i = 0; i < paths.length; i++) {
				if(fs.existsSync(paths[i])) {
					path = paths[i];
					break;
				}
			}

			// if bower.json was found, require it and try get the main file
			var main = path ? require(path).main : undefined;

			if(typeof main === 'string') {
				files.push(p.join(dir, pkg, main));
			} else if (main instanceof Array) {
				files.push.apply(files, main.map(function(file) { return p.join(dir, pkg, file); }));
			} else {
				// if we did not find a file, check for a js file with bower package name
				var file = pkg + '.js';
				if(fs.existsSync(p.join(dir, pkg, file))) files.push(p.join(dir, pkg, file));
				else console.log('did not find a file for ' + pkg);
			}
		});

	}

	return files;
}

var config = gulp.config.bower;

gulp.task('bower', function() {
	_.each(bower(config.src), function(src, dest) {
		gulp.src(src).
			pipe(uglify()).pipe(rename(function(p){
				p.basename = _.difference(p.basename.split(/[-_\.]/), ['dist', 'src', 'min', 'js']).join('-');
			})).pipe(gulp.dest(config.dest));
	});
});
