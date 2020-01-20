const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCss = require('optimize-css-assets-webpack-plugin');
// const TransfromAssets = require('./transfromAssets');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const {
	CleanWebpackPlugin
} = require('clean-webpack-plugin');
var config = require('./config');
//js 压缩
const uglify = require('uglifyjs-webpack-plugin');
//node 文件操作模块
const fs = require('fs');
const path = require('path');
var entryFiles = fs.readdirSync(path.resolve(__dirname, '../src/script'));
var rFiles = entryFiles.filter(v => v.endsWith('.js'));
var plugins = [];
rFiles.forEach(v => {
	v = v.substring(0, v.lastIndexOf('.'))
	plugins.push(
		new HtmlWebpackPlugin({
			filename: path.resolve(__dirname, '../dist', `${v}.html`),
			template: path.resolve(__dirname, '../src', `${v}.ejs`),
            //是否插入生成好的chunks body | head | true | false
			inject: false,
            //指定该html引入的chunks 
			chunks: [v],
			//favicon: './src/assets/img/favicon.ico',
			//压缩配置
			minify: {
				//删除Html注释
				removeComments: true,
				//去除空格
				collapseWhitespace: true,
				//去除属性引号
				removeAttributeQuotes: false
			},
		})
	)
})

var otherPlugins = [
	new MiniCssExtractPlugin({
		filename: config.path.css + '/[name].[hash:8].css',
		chunkFilename: '[id].css',
	}),
	new optimizeCss({
		assetNameRegExp: /\.css$/g,
		cssProcessor: require('cssnano'),
		cssProcessorOptions: {
			discardComments: {
				removeAll: true
			}
		},
		canPrint: true
	}),
	// new TransfromAssets(),
	// new webpack.HotModuleReplacementPlugin(),
	new webpack.NamedModulesPlugin(),
	new CleanWebpackPlugin(),
	new uglify()
];

plugins.splice(entryFiles.length, 0, ...otherPlugins);

module.exports = plugins;
