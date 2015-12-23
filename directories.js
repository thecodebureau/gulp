var p = require('path');

module.exports = {
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
};

