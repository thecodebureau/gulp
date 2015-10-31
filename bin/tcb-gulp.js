#!/usr/bin/env node

var p = require('path'),
	fs = require('fs'),
	spawn = require('child_process').spawn;

var tcbGulpPath = p.dirname(__dirname),
	gulpExecutable = p.join(tcbGulpPath, 'node_modules/.bin/gulp');

if(!fs.existsSync(gulpExecutable)) {
	gulpExecutable = p.join(p.dirname(tcbGulpPath), '.bin/gulp');
}

var gulpProcess = spawn(gulpExecutable, [ '--cwd', tcbGulpPath ], { stdio: 'inherit' });

gulpProcess.on('close', function() {
	console.log('Gulp process exited');
});

gulpProcess.on('SIGINT', function() {
	console.log('gulp process SIGINT');
});

process.on('SIGINT', function() {
	console.log('main process siginit');
	gulpProcess.kill();
	process.exit();
	


});
