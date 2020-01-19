const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCss = require('optimize-css-assets-webpack-plugin');
const TransfromAssets = require('./transfromAssets');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
//node 文件操作模块
const fs = require('fs');
const path = require('path');
const entryFiles = fs.readdirSync(path.resolve(__dirname, '../src'));
const rFiles = entryFiles.filter(v => v.endsWith('.ejs'));
const plugins = [];

//用来清除残留打包文件
plugins.push(new CleanWebpackPlugin())

rFiles.forEach(v => {
  v = v.substring(0,v.lastIndexOf('.'))
  plugins.push(
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist', `${v}.html`),
      template: path.resolve(__dirname, '../src', `${v}.ejs`),
      inject: true,
      chunks: ['common', v],
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

const otherPlugins = [
  new MiniCssExtractPlugin({
    filename: '[name].[hash:8].css',
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
  new TransfromAssets(),
	new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new FriendlyErrorsPlugin({
      //编译成功提示！
      compilationSuccessInfo: {
        messages: [`Your application is running`]
      },
      //编译出错！
      onErrors: function(severity, errors) {
        if (severity !== 'error') {
          return;
        }
        const error = errors[0];
        const filename = error.file.split('!').pop();
		console.error(severity + ': ' + error.name)
      }
    })
];

plugins.splice(entryFiles.length, 0, ...otherPlugins);

module.exports = plugins;
