module.exports = function(defaultConfig, userConfig) {
	var config = userConfig || defaultConfig;

	if(_.isPlainObject(config) && _.intersection(_.keys(config), [ 'defaults', 'development', 'testing', 'staging', 'production' ]).length) {
		var defaults = config.defaults;
		var env = config[ENV];

		return _.isPlainObject(defaults || env) ? _.merge({}, config.defaults, config[ENV]) : env || defaults;
	} else
		return config;
};
