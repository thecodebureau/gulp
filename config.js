// native modules
var path = require('path');
var fs = require('fs');

// 3rd party modules
var _ = require('lodash');

module.exports = function(config) {
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
			src: path.join(config.dir.root, 'bower_components'),
			dest: path.join(config.dir.public.scripts, 'bower')
		}
	};

	var browserSync = {
		defaults: {},
		development: {
			browser: '',
			ghostMode: false,
			proxy: "localhost:" + config.port,
			files: [
				path.join(config.dir.public.css, '**/*.css'),
				path.join(config.dir.public.scripts, '**/*.js'),
				// won't reload correctly for dust templates. Assuming it has to do with nodemon restarting node and node compiling templates.
				//path.join(config.dir.server.templates, '**/*.{html,dust}'),
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
			dest: config.dir.public.scripts,
			entries: [ 
				'app.js',
				'admin/app.js'
			],
			paths: [ path.join(PWD, 'hatter_modules') ],
			// outputs only need to be used if output names are different from entries. Otherwise the entries array is copied into the outputs array.
			outputs: [
				'app.js',
				'admin.js'
			],
			src: config.dir.src.scripts
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
			src: path.join(config.dir.src.fonts, '**/*.{eot,ttf,woff}'),
			dest: config.dir.public.fonts
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
			src: path.join(config.dir.src.raster, '**/*.{png,gif,jpg}'),
			dest: config.dir.public.img
		}
	};
	var sass =  {
		defaults: {
			src:  path.join(config.dir.src.sass, '**/*.{sass,scss}'),
			dest: config.dir.public.css,
			options: {
				outputStyle: 'nested',
				includePaths: ['./node_modules/spysass/sass'],
				imagePath: '../img',
			}
		}
	};
	var static = {
		defaults: {
			src: path.join(config.dir.src.static, '**/*'),
			dest: config.dir.public.root
		}
	};
	var tasks = {
		development: {
			default: [ 'wipe', [ 'bower', 'browserify', 'fonts', 'nodemon', 'raster', 'sass', 'svg' ], [ 'watch', 'browser-sync' ] ]
		},
		production: {
			default: [ 'wipe', [ 'bower', 'browserify', 'fonts', 'raster', 'sass', 'svg' ]]
		}
	};
	var svg = {
		defaults: {
			src: path.join(config.dir.src.svg, '**/*.svg'),
			dest: config.dir.public.img
		}
	};
	var watch = {
		defaults: {
			browserify: path.join(config.dir.src.scripts, '**/*.js'),
			sass:    path.join(config.dir.src.sass, '**/*.{sass,scss}')
		}
	};
	var wipe = {
		defaults: {
			src: [ config.dir.public.root ]
		}
	};
	return {
		autoprefixer: _.merge(autoprefixer.defaults, autoprefixer[ENV], config.autoprefixer),
		bower: _.merge(bower.defaults, bower[ENV], config.bower),
		browserSync: _.merge(browserSync.defaults, browserSync[ENV], config.browserSync),
		browserify: _.merge(browserify.defaults, browserify[ENV], config.browserify),
		fonts: _.merge(fonts.defaults, fonts[ENV], config.fonts),
		nodemon: _.merge(nodemon.defaults, nodemon[ENV], config.nodemon),
		raster: _.merge(raster.defaults, raster[ENV], config.raster),
		sass: _.merge(sass.defaults, sass[ENV], config.sass),
		static: _.merge(static.defaults, static[ENV], config.static),
		tasks: tasks[ENV],
		svg: _.merge(svg.defaults, svg[ENV], config.svg),
		watch: _.merge(watch.defaults, watch[ENV], config.watch),
		wipe: _.merge(wipe.defaults, wipe[ENV], config.wipe)
	};
};
