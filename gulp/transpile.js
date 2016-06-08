
module.exports = function(gulp, $, p_src, p_dest) {

	// load all javascript source files
	return gulp.src(p_src+'/**/*.js')

		// lint all javascript source files
		.pipe($.eslint())
		.pipe($.eslint.format())

		// preserve mappings to source files for debugging
		.pipe($.sourcemaps.init())

			// transpile
			.pipe($.babel())
		.pipe($.sourcemaps.write())

		// write output to dist directory
		.pipe(gulp.dest(p_dest));
};

module.exports.plugins = [
	'gulp-eslint',
	'gulp-sourcemaps',
	'gulp-babel',
];
