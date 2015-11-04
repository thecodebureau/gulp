var fs = require('fs');
var rimraf = require('rimraf');

module.exports = function(gulp, config) {
	config = config.wipe || config;
	gulp.task('wipe', function(cb) {
		var count = 0;
		config.src.forEach(function(folder) {
			fs.exists(folder, function(exists) {
				if(exists) {
					rimraf(folder, function(err){
						if(err) throw err;
						//notify('Folder \033[35m' + folder + '\033[0m removed');
						count++;
						if(count >= config.src.length) {
							cb();
						}
					});
				} else {
					count++;
					if(count >= config.src.length) {
						cb();
					}
				}
			});
		});
	});
};
