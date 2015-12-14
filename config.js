// native modules
var p = require('path');
var fs = require('fs');

// TODO test if defaults,production on object
var port = require(p.join(PWD, 'server/config/port'));

var userConfig = fs.existsSync(p.join(PWD, 'gulpconfig.js')) ? require(p.join(PWD, 'gulpconfig.js')) : {};

var dir = _.merge({
	// Any code that needs to a "middle landing spot" while built, place it anywhere here
	build: {
		root: p.join(PWD, 'build')
	},

	// public directories. Where all static/built/live content goes.
	// make sure epiphany static dir points to the correct public direcotry
	dest: {
		css: p.join(PWD, 'public', 'css'),
		fonts: p.join(PWD, 'public', 'fonts'),
		img: p.join(PWD, 'public', 'img'),
		root: p.join(PWD, 'public'),
		// make sure epiphany's template directory points here
		templates: p.join(PWD, 'public', 'uncompiled-templates'),
		scripts: p.join(PWD, 'public', 'js')
	},

	// Source directories. This is where you put all content that needs to be built before use.
	src: {
		fonts: p.join(PWD, 'src', 'fonts'),
		raster: p.join(PWD, 'src', 'raster'),
		root: p.join(PWD, 'src'),
		sass: p.join(PWD, 'src', 'sass'),
		static: p.join(PWD, 'src', 'static'),
		scripts: p.join(PWD, 'src', 'js'),
		templates: p.join(PWD, 'src', 'templates'),
		svg: p.join(PWD, 'src', 'svg'),
	}
}, userConfig.dir);

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
		src: p.join(PWD, 'bower_components'),
		dest: p.join(dir.dest.scripts, 'vendor')
	}
};

var browserSync = {
	defaults: {},
	development: {
		browser: null,
		ghostMode: false,
		proxy: "localhost:" + port,
		files: [
			p.join(dir.dest.css, '**/*.css'),
			p.join(dir.dest.scripts, '**/*.js'),
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
		dest: dir.dest.scripts,
		paths: [ p.join(PWD, 'node_modules'), p.join(PWD, 'modules') ],// PWD/node_modules is added so symlinked ridge does not break. used to work without this in browserify 9
		//paths: [ p.join(PWD, 'node_modules/hats'), p.join(PWD, 'hats') ],
		// outputs only need to be used if output names are different from entries. Otherwise the entries array is copied into the outputs array.
		entries: [
			'app.js',
			'admin/app.js'
		],
		outputs: [
			'app.js',
			'admin.js'
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
		dest: dir.dest.templates,
	}
};

var fonts = {
	defaults: {
		src: p.join(dir.src.fonts, '**/*.{eot,ttf,woff}'),
		dest: dir.dest.fonts
	}
};

var nodemon = {
	defaults: _.merge(require(p.join(PWD, 'nodemon.json')), {
		script: require(p.join(PWD, 'package.json')).main.replace(/^\./, PWD),
		env: {
			EXTERNAL_PORT: 3000,// what port you actually put into the browser... when using browser-sync this will differ from the internal port used by express
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
		dest: dir.dest.img
	}
};

var sass =  {
	defaults: {
		src:  p.join(dir.src.sass, '**/*.{sass,scss}'),
		dest: dir.dest.css,
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
		dest: dir.dest.root
	}
};

var tasks = {
	development: [ 'wipe', [ 'bower', 'browserify', 'dust', 'fonts','raster', 'sass', 'static', 'svg' ], [ 'nodemon' ], [ 'watch', 'browser-sync' ] ],
	production: [ 'wipe', [ 'bower', 'browserify', 'dust', 'fonts', 'raster', 'sass', 'static', 'svg' ]]
};

var svg = {
	defaults: {
		src: p.join(dir.src.svg, '**/*.svg'),
		dest: dir.dest.img
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
		src: [ dir.dest.root ]
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
	tasks: userConfig.tasks ? userConfig.tasks[ENV] || userConfig.tasks : tasks[ENV],
	svg: _.merge(svg.defaults, svg[ENV], userConfig.svg),
	watch: _.merge(watch.defaults, watch[ENV], userConfig.watch),
	wipe: _.merge(wipe.defaults, wipe[ENV], userConfig.wipe)
}, userConfig);
