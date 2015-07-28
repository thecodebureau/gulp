var util = require('gulp-util');
var chalk = require('chalk');

module.exports = function(err) {

	util.log(chalk.red('ERROR') + ' in task \'' + chalk.cyan(err.task) + '\'');
	console.log('\n' + err.message + '\n');

	// needed for error handling not thrown by gulp-watch
	if(this.emit) {
		// Keep gulp from hanging on this task
		this.emit('end');
	}
};
