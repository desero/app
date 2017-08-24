var PAGES = [
	'index',
	'single',
	'list',
	'gallery'
]

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
var glob = require('glob');
var _ = require('lodash');
var baseDir = path.join(__dirname, 'app/')

var webpackConfig = {
	context: path.resolve('./app'),
	entry: ['./javascript/scripts.js'],
	output: {
		path: path.resolve('./dist/'),
		filename: 'js/bundle.js',
		publicPath: '/'
	},
	module : {}
}

webpackConfig.plugins = [
	new CleanWebpackPlugin(['dist']),
	new ExtractTextPlugin('./css/[name].css'),
	new webpack.ProvidePlugin({
		$: 'jquery',
		jQuery: 'jquery',
	}),
	new BrowserSyncPlugin({
		server: {
			baseDir: ['dist']
		},
		port: 3000,
		host: 'localhost',
		open: false,
		notify: false
	}),
	new CopyWebpackPlugin([
		{
			from: './favicon.ico'
		},
		{
			from: './images/**/*',
			to: './'
		}
	])
].concat(PAGES.map(function (page) {
	return new HtmlWebpackPlugin({
		filename: `${page}.html`,
		template: `${baseDir}${page}.html.twig`
	})
}))

webpackConfig.module.rules = [{
	test: /\.js$/,
	loader: 'babel-loader',
	exclude: /node_modules/,
	query: 'presets=es2015'
}]

webpackConfig.module.rules.push({
	test: /\.html$/,
	loader: "html-loader"
})

webpackConfig.module.rules.push({
	test: /\.twig$/,
	loader: "twig-loader"
})

webpackConfig.module.rules.push({
	test: /\.scss$/,
	loader: ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: "css-loader!sass-loader!webpack-px-to-rem?basePx=16"
  })
})

webpackConfig.module.rules.push({
	test: /\.css$/,
	loaders: ["style-loader", "css-loader"]
})

webpackConfig.module.rules.push({
	test: /\.(jpe?g|png|gif|svg)$/,
	exclude: [/fonts/],
	loader: "file-loader?name=images/[name].[ext]"
})

webpackConfig.module.rules.push({
	test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
	exclude: [/images/],
	loader: 'file-loader?name=fonts/[name].[ext]'
})

module.exports = webpackConfig
