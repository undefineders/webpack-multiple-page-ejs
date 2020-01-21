//node 文件操作模块
const fs = require('fs');
//node 路径模块
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCss = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
var config = require('./config');

// 遍历获取src目录下的启动js模块文件
const glob = require('glob');
const PAGE_PATH = path.resolve(__dirname, `${config.path.entry}`)
// console.log(PAGE_PATH)
var rFiles = glob.sync(PAGE_PATH + '/**/*.js');
// console.log(entryFiles)
// var join = require('path').join;
// var rFiles = [];
// function getJsonFiles(jsonPath){
//     function findJsonFile(path){
//         let files = fs.readdirSync(path);
//         files.forEach(function (item, index) {
//             let fPath = join(path,item);
//             let stat = fs.statSync(fPath);
//             if(stat.isDirectory() === true && item !="common") {
//                 findJsonFile(fPath);
//             }
//             if (stat.isFile() === true && item.endsWith('.js')) { 
//               rFiles.push(fPath.replace(/\\/g,'/'));
//             }
//         });
//     }
//     findJsonFile(jsonPath);
// }
// getJsonFiles(`./${config.path.entry}`)

var entryList = {}
var jsFiles = []
rFiles.map((v, k) => {
	var path = v.substring(v.lastIndexOf(`${config.path.entry}`)+`${config.path.entry}`.length+1, v.lastIndexOf('.'))
	v = v.substring(v.lastIndexOf('/')+1, v.lastIndexOf('.'))
    entryList[v] = `@${config.path.entry}/${path}.js`
	jsFiles.push({'filename':v,'template':`${path}`})
});

console.log(entryList)
console.log(jsFiles)

if (module.hot) {
	console.log('hot')
  module.hot.accept('*');
}

module.exports = (env, argv) => {
    process.env.NODE_ENV = argv.mode
    console.log(process.env.NODE_ENV);
    
    var htmlPlugins = [];
    var prodPlugins = [];
    
    jsFiles.forEach(item => {
    	htmlPlugins.push(
    		new HtmlWebpackPlugin({
    			filename: path.resolve(__dirname, `${config.path.out}`, `${item.filename}.html`),
    			template: path.resolve(__dirname, `${config.path.entry}`, `${item.template}.ejs`),
                //是否插入生成好的chunks body | head | true | false
    			inject: process.env.NODE_ENV != 'production',
                //指定该html引入的chunks 
    			chunks: [`${item.filename}`],
    			//favicon: './src/assets/img/favicon.ico',
    			//压缩配置
    			minify: process.env.NODE_ENV == 'production'?{
    				//删除Html注释
    				removeComments: true,
    				//去除空格
    				collapseWhitespace: true,
    				//去除属性引号
    				removeAttributeQuotes: true
    			}:{
                    //去除空格
                    collapseWhitespace: true,
                }
    		})
    	)
    })
    
    if(process.env.NODE_ENV == 'production'){
        prodPlugins.push(
            new optimizeCss({
            	assetNameRegExp: /\.css$/g,
            	cssProcessor: require('cssnano'),
            	cssProcessorOptions: {
            		discardComments: {
            			removeAll: true
            		}
            	},
                //是否将插件信息打印到控制台
            	canPrint: true
            })
        )
        prodPlugins.push(new CleanWebpackPlugin())
    }
    
    return {
        mode: process.env.NODE_ENV,
        entry: entryList,
        output: {
        	path: path.resolve(__dirname, `${config.path.out}/`),
        	filename: config.path.js+"/[name].[chunkhash:8].js",
        	publicPath: ""
        },
        devServer: {
        	inline: true,
        	open: true,
			// hot:true,
        	historyApiFallback: true,
        	port: config.port,
            //配置是否启用 gzip 压缩。boolean 为类型，默认为 false
        	compress: process.env.NODE_ENV == 'production',
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
            //重命名功能
        	alias: {
        		'@': path.resolve(__dirname, '.'),
        		'@src': path.resolve(__dirname, '.', 'src'),
                'vue': 'vue/dist/vue.js'
        	}
        },
        module: {
        	rules: [{
                test: /\.ejs/,
                use: [
                    'ejs-loader'
                ],
            },{
                test: /\.vue$/,
                use: ['vue-loader']
            },{
                test: /\.(c|le)ss$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require("autoprefixer")
                            ]
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.js$/, //js文件加载器
                exclude: path.resolve(__dirname,'node_modules'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        interpolate: true,
                        minimize: false
                    }
                }]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    esModule: false, // 这里设置为false
                    name: config.path.img+'/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    esModule: false, // 这里设置为false
                    name: config.path.other+'/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    esModule: false, // 这里设置为false
                    name: config.path.fonts+'/[name].[hash:8].[ext]'
                }
            }]
        },
        plugins:[
            ...htmlPlugins,
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
            	filename: config.path.css+'/[name].[hash:8].css',
            	chunkFilename: '[id].css',
            }),
            ...prodPlugins,
			// new webpack.HotModuleReplacementPlugin()
        ]
    }
}
