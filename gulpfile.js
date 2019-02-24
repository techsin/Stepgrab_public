var gulp = require("gulp"),
	browserSync = require("browser-sync"),
	less = require("gulp-less"),
	nodemon = require("gulp-nodemon"),
	webpack = require("webpack"),
	webpackConfig = require("./webpack.config.js"),
	webpackDevMiddleware = require("webpack-dev-middleware"),
	webpackHotMiddleware = require("webpack-hot-middleware"),
	bundler = webpack(webpackConfig);

const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");

// Main Entry
gulp.task("serve", ["nodemon", "less"], function () {
	browserSync.init({
		proxy: {
			target: "localhost:3000",
			ws: true
		},
		port: 8080,
		notify: true,
		middleware: [
			webpackDevMiddleware(bundler, {
				publicPath: webpackConfig.output.publicPath,
				stats: { colors: true }
			}),
			webpackHotMiddleware(bundler)
		]
	});

	gulp.watch("frontend/styles/**/*.less", ["less"]);
	gulp.watch("backend/views/**/*.pug").on("change", browserSync.reload);
});

// less to CSS and Inject via BrowserSync
gulp.task("less", function () {
	return gulp
		.src("./frontend/styles/**/*.less")
		.pipe(less({ outputStyle: "compressed" }))
		.on("error", swallowError)
		.pipe(
			autoprefixer({
				browsers: ["last 2 versions"],
				cascade: false
			})
		)
		.pipe(cleanCSS())
		.pipe(gulp.dest("./public/css/"))
		.pipe(browserSync.stream());
});

//Nodemon
gulp.task("nodemon", function (cb) {
	var started = false;
	return nodemon({
		script: "app.js",
		nodeArgs: ["--inspect"],
		ignore: ["frontend/", "gulpfile.js", "webpack.config.js", "public/"]
	})
		.on("start", function () {
			if (!started) {
				cb();
				started = true;
			}
		})
		.once("quit", function () {
			process.exit();
		});
});

gulp.task("default", ["serve"]);
gulp.task("build", ["less"]);

function swallowError(error) {
	// If you want details of the error in the console
	console.log(error.toString());

	this.emit("end");
}
