var path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base')
const dev = require("./config/dev")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(base, {
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/', //在打包后的文件路径前加前缀,/表示根路径
        filename: 'main.js'
    },
    // mode:"development",//开发模式，告诉webpack使用相应模式的内置优化，也可以通过CLI参数中传递：webpack --mode=development
    // devtool: 'source-map',//会生成对于调试的完整的.map文件，但同时也会减慢打包速度
    devServer: {
        contentBase:path.join(__dirname, '../dist'),//启动服务的资源文件目录
        port:9000,
        compress: true, //压缩文件
        historyApiFallback:true, //设置为true，所有的跳转将指向index.html
        // inline: true, //修改源码文件后实时刷新 不添加这个也支持热更新了？
        // open:true//是否打开浏览器
        // hot:true//是否启动热更新
        proxy: {  //配置代理
            '/api': {
                target: 'http://127.0.0.1:3000',
                pathRewrite: {'^/api' : ''} //重写路径
            }
        }
    },
    devtool:'inline-source-map',//开发环境启动js的sourcemap
    module: {
        rules: [
            {
                test: /\.(scss|sass|css)$/,
                use:['style-loader',{
                    loader:'css-loader',
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        sourceMap: true,
                        plugins: (loader) => [
                            require('autoprefixer')({overrideBrowserslist:['> 0.15% in CN']}) //添加前缀，浏览器版本包括国内常用的，包括ie8
                        ]
                    }
                }, {
                    loader:'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }]
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({  // DefinePlugin可以在编译时期创建全局变量。
            'process.env':dev
        }),
        new BundleAnalyzerPlugin()
    ]
})