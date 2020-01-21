const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
var config = require('./config');


//loader的执行顺序是从右向左的
module.exports = [
    {
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
            name: config.path.fonts+'[name].[hash:8].[ext]'
        }
    }
]
