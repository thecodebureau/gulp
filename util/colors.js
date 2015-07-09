var gulpUtil = require('gulp-util');

gulpUtil.colors.styles.blue.open = '\u001b[33m';
gulpUtil.colors.styles.cyan.open = '\u001b[34m';
gulpUtil.colors.styles.magenta.open = '\u001b[32m';

console.log(gulpUtil.colors.magenta('hello'));
