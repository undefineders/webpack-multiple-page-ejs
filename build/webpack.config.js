//node 文件操作模块
const fs = require('fs');
//node 路径模块
const path = require('path');
//使用node.js 的文件操作模块来获取src文件夹下的文件夹名称 ->[about,common,home]
var entryFiles = fs.readdirSync(path.resolve(__dirname, '../src/script'));
var plugins = require('./plugins');
var rules = require('./rules');
var config = require('./config');
var rFiles = entryFiles.filter(v => v.endsWith('.js'));

var entryList = {}
rFiles.map((v, k) => {
	v = v.substring(0, v.lastIndexOf('.'))
	entryList[v] = `@src/script/${v}.js`
});
//console.log('开始进入 webpack!',entryList,plugins);

module.exports = {
	entry: entryList,
	output: {
		path: path.resolve(__dirname, '../dist/'),
		filename: config.path.js + "/[name].[chunkhash:8].js",
		publicPath: ""
	},
	devServer: {
		inline: true,
		//open: true,
		// hot:true,
		historyApiFallback: true,
		port: config.port,
		compress: true,
		overlay: {
			errors: true,
			warnings: false
		},
		quiet: true
	},
	resolve: {
		alias: {
			'@': path.join(__dirname, '..'),
			'@src': path.join(__dirname, '..', 'src')
		}
	},
	module: {
		rules
	},
	plugins
}
