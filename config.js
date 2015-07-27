// native modules
var path = require('path');
var fs = require('fs');

// 3rd party modules
var _ = require('lodash');

// PWD and ENV should be set in boun
//var PWD = process.env.PWD;
//var ENV = process.env.NODE_ENV || 'development';

// TODO test if defaults,production on object
var port = require(path.join(PWD, 'server/config/port'));
var dir = require(path.join(PWD, 'server/config/dir'));

var userConfig = fs.existsSync(path.join(PWD, 'server/config/gulp.js')) ? require(path.join(PWD, 'server/config/gulp')) : {};

var autoprefixer = {
	defaults: {
		browsers: [
			'safari >= 5',
			'ie >= 8',
			'ios >= 6',
			'opera >= 12.1',
			'firefox >= 17',
			'chrome >= 30',
			'android >= 4'
		],
		cascade: true
	}
};
var bower = {
	defaults: {
		src: path.join(dir.root, 'bower_components'),
		dest: path.join(dir.public.scripts, 'bower')
	}
};

var browserSync = {
	defaults: {},
	development: {
		browser: 'chromium',
		ghostMode: false,
		proxy: "localhost:" + port,
		files: [
			path.join(dir.public.css, '**/*.css'),
			path.join(dir.public.scripts, '**/*.js'),
			// won't reload correctly for dust templates. Assuming it has to do with nodemon restarting node and node compiling templates.
			//path.join(dir.server.templates, '**/*.{html,dust}'),
		]
	}
};
var browserify = {
	defaults: {
		// All these are for lazy loading of bundles
		//hasExports: false,
		//prelude: 'loadBundle',
		//_require: true,
		debug: true,
		dest: dir.public.scripts,
		entries: [ 
			'app.js'
		],
		paths: [ path.join(PWD, 'node_modules/hats'), path.join(PWD, 'hats') ],
		// outputs only need to be used if output names are different from entries. Otherwise the entries array is copied into the outputs array.
		outputs: [
			'app.js'
		],
		src: dir.src.scripts
	},
	development: {
		// Enable source maps
		// All these are for watchify which is not used right now, using native gulp watch instead
		//fullPaths: true,
		//packageCache: {},
		//cache: {},
	},
	production: {
	}
};

var fonts = {
	defaults: {
		src: path.join(dir.src.fonts, '**/*.{eot,ttf,woff}'),
		dest: dir.public.fonts
	}
};

var nodemon = {
	// load all nodemon settings from nodemon.json and merge with { reloadDelay: 300, script: ('package.json').main }. overrides found below
	defaults: _.merge(require(path.join(process.env.PWD, 'nodemon.json')),
		{ reloadDelay: 300, script: require(path.join(process.env.PWD, 'package.json')).main })
	//defaults: {
	//	script: "server/server.js",
	//	ext: "js,dust",
	//	reloadDelay: 500,
	//	watch: [ "config", "server" ]
	//}
};
var raster = {
	defaults: {
		src: path.join(dir.src.raster, '**/*.{png,gif,jpg}'),
		dest: dir.public.img
	}
};

var sass =  {
	defaults: {
		src:  path.join(dir.src.sass, '**/*.{sass,scss}'),
		dest: dir.public.css,
		options: {
			outputStyle: 'nested',
			includePaths: ['./node_modules/spysass/sass'],
			imagePath: '../img',
		}
	}
};

var static = {
	defaults: {
		src: path.join(dir.src.static, '**/*'),//NOTE exlusion of directories is done in the static task file
		dest: dir.public.root
	}
};

var tasks = {
	development: {
		default: [ 'wipe', [ 'bower', 'browserify', 'fonts', 'nodemon', 'raster', 'sass', 'static', 'svg' ], [ 'watch', 'browser-sync' ] ]
	},
	production: {
		default: [ 'wipe', [ 'bower', 'browserify', 'fonts', 'raster', 'sass', 'static', 'svg' ]]
	}
};

var svg = {
	defaults: {
		src: path.join(dir.src.svg, '**/*.svg'),
		dest: dir.public.img
	}
};

var watch = {
	defaults: {
		browserify: path.join(dir.src.scripts, '**/*.js'),
		sass:    path.join(dir.src.sass, '**/*.{sass,scss}')
	}
};

var wipe = {
	defaults: {
		src: [ dir.public.root ]
	}
};

// TODO allow defaults, production etc in userConfig
module.exports = {

	autoprefixer: _.merge(autoprefixer.defaults, autoprefixer[ENV], userConfig.autoprefixer),
	bower: _.merge(bower.defaults, bower[ENV], userConfig.bower),
	browserSync: _.merge(browserSync.defaults, browserSync[ENV], userConfig.browserSync),
	browserify: _.merge(browserify.defaults, browserify[ENV], userConfig.browserify),
	fonts: _.merge(fonts.defaults, fonts[ENV], userConfig.fonts),
	nodemon: _.merge(nodemon.defaults, nodemon[ENV], userConfig.nodemon),
	raster: _.merge(raster.defaults, raster[ENV], userConfig.raster),
	sass: _.merge(sass.defaults, sass[ENV], userConfig.sass),
	static: _.merge(static.defaults, static[ENV], userConfig.static),
	tasks: tasks[ENV],
	svg: _.merge(svg.defaults, svg[ENV], userConfig.svg),
	watch: _.merge(watch.defaults, watch[ENV], userConfig.watch),
	wipe: _.merge(wipe.defaults, wipe[ENV], userConfig.wipe)
};
