const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base')
const PurifyCssWebpack = require('purifycss-webpack') //移除未引用冗余的css样式
const glob = require('glob')//用于扫描全部html文件中所引用的css
const dev = require('./config/prod')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//打包前清理目录文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//把css抽离成单独文件，webpack4版本使用这个插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css文件
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');//压缩js文件

module.exports = merge(base, {
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/', //在打包后的文件路径前加前缀,/表示根路径
        filename: '[name]-[hash].bundle.js'
    },
    // mode: "production",//生产模式，告诉webpack使用相应模式的内置优化，也可以通过CLI参数中传递：webpack --mode=production
    module: {
        rules: [
            {
                test: /\.(scss|sass|css)$/,
                use:[{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      // you can specify a publicPath here
                      // by default it uses publicPath in webpackOptions.output
                    //   publicPath: '../',
                    //   hmr: process.env.NODE_ENV === 'development',
                    },
                },'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        sourceMap: true,
                        plugins: (loader) => [
                            require('autoprefixer')({overrideBrowserslist:['> 0.15% in CN']}) //添加前缀，浏览器版本包括国内常用的，包括ie8
                        ]
                    }
                }, 'sass-loader']
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({ //单独提取css文件
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].[hash].css',
            chunkFilename: '[id].css',
        }),
        new OptimizeCssAssetsPlugin({ //压缩css
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
              preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
        new PurifyCssWebpack({ //移除未引用的冗余的css样式
            paths: glob.sync(path.join(__dirname, 'src/*.html')) //同步扫描所有html文件中所引用的css
        }),
        new webpack.DefinePlugin({
            'process.env': dev
        }),
        new CleanWebpackPlugin(), //清理dist文件夹下所有文件，需放在最后一个
    ],
    // optimization: {
    //     minimizer: [new UglifyJsPlugin()], //压缩js插件
    // },
})