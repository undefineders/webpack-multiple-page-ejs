//node 文件操作模块
const fs = require('fs');
//node 路径模块
const path = require('path');
//使用node.js 的文件操作模块来获取src文件夹下的文件夹名称 ->[about,common,home]
const entryFiles = fs.readdirSync(path.resolve(__dirname, '../src'));
const plugins = require('./plugins');
const rules = require('./rules');
const rFiles = entryFiles.filter(v => v.endsWith('.ejs'));

const entryList = {}
rFiles.map((v, k) => {
  v = v.substring(0,v.lastIndexOf('.'))
	entryList[v] = `@src/js/${v}.js`
});
//console.log('开始进入 webpack!',entryList,plugins);

module.exports = {
  entry: entryList,
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: "[name].[hash:8].js",
    publicPath: ""
  },
  devServer: {
    inline: true,
	//open: true,
	//hot:true,
    historyApiFallback: true,
	port: 5438,
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
