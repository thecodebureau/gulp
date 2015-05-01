var util = require('gulp-util');

module.exports = function(err) {
  //var args = Array.prototype.slice.call(arguments);
	util.log(err.message ? err.message.trim() : 'NO NAME HERE');
	util.log(err.stack);

  // Send error to notification center with gulp-notify
  //notify.onError({
  //  title: "Compile Error",
  //  message: "<%= error.message %>"
  //}).apply(this, args);

	// needed for error handling not thrown by gulp-watch
	if(this.emit)
		// Keep gulp from hanging on this task
		this.emit('end');
};
