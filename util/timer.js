var prettyHrtime = require('pretty-hrtime');

module.exports = function() {
	return function(startTime) {
		return {
			end: function() {
				var taskTime = process.hrtime(startTime);
				return prettyHrtime(taskTime);
			}
		};
	}(process.hrtime());
};
