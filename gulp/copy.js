
module.exports = function(gulp, $, p_src, p_dest) {

	// open read stream on source
	gulp.src(p_src)

		// output
		.pipe(gulp.dest(p_dest));
};
