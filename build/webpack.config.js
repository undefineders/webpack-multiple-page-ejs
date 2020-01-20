//node 文件操作模块
const fs = require('fs');
//node 路径模块
const path = require('path');
//使用node.js 的文件操作模块来获取src文件夹下的文件夹名称 ->[about,common,home]
var entryFiles = fs.readdirSync(path.resolve(__dirname, '../src'));
var plugins = require('./plugins');
var rules = require('./rules');
var config = require('./config');
var rFiles = entryFiles.filter(v => v.endsWith('.js'));

var entryList = {}
rFiles.map((v, k) => {
	v = v.substring(0, v.lastIndexOf('.'))
	entryList[v] = `@src/${v}.js`
});
//console.log('开始进入 webpack!',entryList,plugins);

module.exports = (env, argv) => {
    return {
        mode:argv,
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
            //配置是否启用 gzip 压缩。boolean 为类型，默认为 false
        	compress: true,
            // 将错误显示在html之上
        	overlay: {
        		errors: true,
        		warnings: false
        	},
            // 启用quet后，除了初始启动信息外的任何内容都不会被打印到控制台。
            // useage via the CLI : webpack-dev-server --quiet
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
}