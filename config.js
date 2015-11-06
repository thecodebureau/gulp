// native modules
var p = require('path');
var fs = require('fs');

// TODO test if defaults,production on object
var port = require(p.join(PWD, 'server/config/port'));
var dir = require(p.join(PWD, 'server/config/dir'));

var userConfig = fs.existsSync(p.join(PWD, 'gulpconfig.js')) ? require(p.join(PWD, 'gulpconfig.js')) : {};

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
		src: p.join(dir.root, 'bower_components'),
		dest: p.join(dir.public.scripts, 'vendor')
	}
};

var browserSync = {
	defaults: {},
	development: {
		browser: 'chromium',
		ghostMode: false,
		proxy: "localhost:" + port,
		files: [
			p.join(dir.public.css, '**/*.css'),
			p.join(dir.public.scripts, '**/*.js'),
			// won't reload correctly for dust templates. Assuming it has to do with nodemon restarting node and node compiling templates.
			//p.join(dir.server.templates, '**/*.{html,dust}'),
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
		paths: [ p.join(PWD, 'node_modules'), p.join(PWD, 'modules') ],// PWD/node_modules is added so symlinked ridge does not break. used to work without this in browserify 9
		//paths: [ p.join(PWD, 'node_modules/hats'), p.join(PWD, 'hats') ],
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

var dust = {
	defaults: {
		// needs to be an array so it can be merged with gulpconfig.js array
		src:  [ p.join(dir.src.templates, '**/*.dust') ],
		dest: dir.public.templates,
	}
};

var fonts = {
	defaults: {
		src: p.join(dir.src.fonts, '**/*.{eot,ttf,woff}'),
		dest: dir.public.fonts
	}
};

var nodemon = {
	defaults: _.merge(require(p.join(PWD, 'nodemon.json')), {
		script: require(p.join(PWD, 'package.json')).main.replace(/^\./, PWD),
		env: {
			PWD: PWD,
			DEBUG_COLORS: true,// needed to force debug to use colors despite tty.istty(0) being false, which it is in a child process
			NODE_ENV: ENV,
			DEBUG: "epiphany:loaders"
		}
	})
};

var raster = {
	defaults: {
		src: p.join(dir.src.raster, '**/*.{png,gif,jpg}'),
		dest: dir.public.img
	}
};

var sass =  {
	defaults: {
		src:  p.join(dir.src.sass, '**/*.{sass,scss}'),
		dest: dir.public.css,
		options: {
			outputStyle: 'nested',
			includePaths: [
				p.join(PWD, 'node_modules/spysass/sass'),
				p.join(PWD, 'node_modules/susy/sass'),
				p.join(PWD, 'node_modules/breakpoint-sass/sass')
			],
			imagePath: '../img',
		}
	}
};

var static = {
	defaults: {
		src: p.join(dir.src.static, '**/*'),//NOTE exlusion of directories is done in the static task file
		dest: dir.public.root
	}
};

var tasks = {
	development: [ 'wipe', [ 'bower', 'browserify', 'dust', 'fonts','raster', 'sass', 'static', 'svg' ], [ 'nodemon' ], [ 'watch', 'browser-sync' ] ],
	production: [ 'wipe', [ 'bower', 'browserify', 'dust', 'fonts', 'raster', 'sass', 'static', 'svg' ]]
};

var svg = {
	defaults: {
		src: p.join(dir.src.svg, '**/*.svg'),
		dest: dir.public.img
	}
};

var watch = {
	defaults: {
		browserify: p.join(dir.src.scripts, '**/*.js'),
		sass: p.join(dir.src.sass, '**/*.{sass,scss}')
	}
};

var wipe = {
	defaults: {
		src: [ dir.public.root ]
	}
};

// TODO allow defaults, production etc in userConfig
module.exports = _.defaults({
	autoprefixer: _.merge(autoprefixer.defaults, autoprefixer[ENV], userConfig.autoprefixer),
	bower: _.merge(bower.defaults, bower[ENV], userConfig.bower),
	browserSync: _.merge(browserSync.defaults, browserSync[ENV], userConfig.browserSync),
	browserify: _.merge(browserify.defaults, browserify[ENV], userConfig.browserify),
	dust: _.merge(dust.defaults, dust[ENV], userConfig.dust, function(a, b) {
		if (_.isArray(a)) {
			return a.concat(b);
		}
	}),
	fonts: _.merge(fonts.defaults, fonts[ENV], userConfig.fonts),
	nodemon: _.merge(nodemon.defaults, nodemon[ENV], userConfig.nodemon),
	raster: _.merge(raster.defaults, raster[ENV], userConfig.raster),
	sass: _.merge(sass.defaults, sass[ENV], userConfig.sass),
	static: _.merge(static.defaults, static[ENV], userConfig.static),
	tasks: (userConfig.tasks ? userConfig.tasks[ENV] : userConfig.tasks) || tasks[ENV],
	svg: _.merge(svg.defaults, svg[ENV], userConfig.svg),
	watch: _.merge(watch.defaults, watch[ENV], userConfig.watch),
	wipe: _.merge(wipe.defaults, wipe[ENV], userConfig.wipe)
}, userConfig);
