const webpack = require("webpack");
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const glob = require("glob");
const PRODUCTION = process.env.NODE_ENV === "production";

const hotware = PRODUCTION ? [] : ["webpack/hot/dev-server", "webpack-hot-middleware/client"];
const entry = {};

glob.sync("./frontend/src/*.js").forEach(function (fpath) {
	let filename = path.basename(fpath, path.extname(fpath));
	entry[filename] = [...hotware, fpath]
});

const plugins = PRODUCTION
	? [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		}),
		new webpack.optimize.UglifyJsPlugin()
	]
	: [
		new webpack.HotModuleReplacementPlugin()
	];



module.exports = {
	entry: entry,
	output: {
		path: path.join(__dirname, "./public/js/"),
		publicPath: "/js/",
		filename: "[name].js",
	},
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
			loaders: [
				"babel-loader",
			],
			exclude: /node_modules/,
		}]
	},
	plugins: plugins,
	devtool: "source-map"
};


    // new HTMLWebpackPlugin({
    //   template: 'index-template.html',
    //   hash: true
    // })
