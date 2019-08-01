var path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    resolve: { //解析配置
        extensions: ['.vue', '.mjs', '.js', '.json'],//配置默认扩展名
        alias: {//配置别名
            '@': path.resolve(__dirname, 'src/'),
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },{
                test: /\.(js|jsx)$/,
                use: [{
                    loader:'babel-loader', //babel转换
                    options: {
                        cacheDirectory: true //指定的目录将用来缓存 loader 的执行结果，提高
                    }
                },{
                    loader: "eslint-loader", //eslint检查
                    options: {
                    // eslint options (if necessary)
                        fix:true //开启自动修复
                    }
                }],
                exclude: /node_modules/ //排除匹配noode_modules模块
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, //正则匹配图片格式
                use: [{
                    loader: 'url-loader', 
                    options: {
                        limit: 81,       //限制只有小于8.192kb的图片才转为base64
                        outputPath: 'images'  //设置打包后图片存放的文件夹名称
                    }
                }]
            }
        ]
    },
    plugins:[//webpack插件的执行顺序是从后往前执行的
        new HtmlWebpackPlugin({ //html-webpack-plugin插件自动生成html模板文件
            template: path.join(__dirname, '../index.html') 
        }),
        // new ExtractTextPlugin({
        //     filename:  (getPath) => {
        //         return getPath('css/[name].css').replace('css/js', 'css');
        //       },
        //       allChunks: true
        // }), //将css分离到/dist文件夹下的css文件夹中的index.css
        
    ],
    externals: { //排除对外部依赖的打包，以下配置的包将不打包到js文件中
        jquery: 'jQuery'
    }
}