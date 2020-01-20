const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCss = require('optimize-css-assets-webpack-plugin');
const {
	CleanWebpackPlugin
} = require('clean-webpack-plugin');
var config = require('./config');
//node 文件操作模块
const fs = require('fs');
const path = require('path');
var entryFiles = fs.readdirSync(path.resolve(__dirname, '../src'));
var rFiles = entryFiles.filter(v => v.endsWith('.js'));
var plugins = [];

module.exports = (env, argv) => {
    
    rFiles.forEach(v => {
        v = v.substring(0, v.lastIndexOf('.'))
        plugins.push(
            new HtmlWebpackPlugin({
                filename: path.resolve(__dirname, '../dist', `${v}.html`),
                template: path.resolve(__dirname, '../src', `tpl/${v}.ejs`),
                //是否插入生成好的chunks body | head | true | false
                inject: false,
                //指定该html引入的chunks 
                chunks: [v],
                //favicon: './src/assets/img/favicon.ico',
                //压缩配置
                minify: argv.mode === 'production'?{
                    //删除Html注释
                    removeComments: false,
                    //去除空格
                    collapseWhitespace: false,
                    //去除属性引号
                    removeAttributeQuotes: false
                }:{
                    //删除Html注释
                    removeComments: false,
                    //去除空格
                    collapseWhitespace: false,
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
    	new CleanWebpackPlugin()
    ];
    
    if(argv.mode === 'production'){
        otherPlugins.push(
            new optimizeCss({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    }
                },
                canPrint: true
            })
        )
    }
    
    plugins.splice(entryFiles.length, 0, ...otherPlugins);
    
    return plugins
}
