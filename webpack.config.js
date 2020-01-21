//node 文件操作模块
const fs = require('fs');
//node 路径模块
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCss = require('optimize-css-assets-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
//使用node.js 的文件操作模块来获取src文件夹下的文件名称
var entryFiles = fs.readdirSync(path.resolve(__dirname, './src'));
var config = require('./config');
var rFiles = entryFiles.filter(v => v.endsWith('.js'));

var entryList = {}
rFiles.map((v, k) => {
	v = v.substring(0, v.lastIndexOf('.'))
	entryList[v] = `@src/${v}.js`
});

module.exports = (env, argv) => {
    process.env.NODE_ENV = argv.mode
    console.log(process.env.NODE_ENV);
    
    var plugins = [];
    rFiles.forEach(v => {
    	v = v.substring(0, v.lastIndexOf('.'))
    	plugins.push(
    		new HtmlWebpackPlugin({
    			filename: path.resolve(__dirname, 'dist', `${v}.html`),
    			template: path.resolve(__dirname, 'src', `tpl/${v}.ejs`),
                //是否插入生成好的chunks body | head | true | false
    			inject: process.env.NODE_ENV != 'production',
                //指定该html引入的chunks 
    			chunks: [v],
    			//favicon: './src/assets/img/favicon.ico',
    			//压缩配置
    			minify: process.env.NODE_ENV == 'production'?{
    				//删除Html注释
    				removeComments: true,
    				//去除空格
    				collapseWhitespace: true,
    				//去除属性引号
    				removeAttributeQuotes: true
    			}:false
    		})
    	)
    })
    
    var otherPlugins = [
    	new MiniCssExtractPlugin({
    		filename: config.path.css + '/[name].[hash:8].css',
    		chunkFilename: '[id].css',
    	})
    ];
    
    if(process.env.NODE_ENV == 'production'){
        otherPlugins.push(
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
        otherPlugins.push(new CleanWebpackPlugin())
    }
    
    plugins.splice(entryFiles.length, 0, ...otherPlugins);
    
    return {
        mode: process.env.NODE_ENV,
        entry: entryList,
        output: {
        	path: path.resolve(__dirname, 'dist/'),
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
        	alias: {
        		'@': path.resolve(__dirname, '.'),
        		'@src': path.resolve(__dirname, '.', 'src')
        	}
        },
        module: {
        	rules: [{
                test: /\.ejs/,
                use: [
                    'ejs-loader'
                ],
            },{
                test: /\.(c|le)ss$/,
                use: [
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
        plugins
    }
}
