# 从零开始搭建webpack

# 目录
* [demo入门](#start)
* [处理css/less/sass模块](#css)
* [css添加css3前缀和sourcemap的处理](#cssSourcemap)
* [css提取成单独文件](#MiniCssExtractPlugin)
* [压缩css和js](#optimize)
* [文件的hash值](#hash)
* [清理打包目录文件](#clean)
* [图片的优化处理base64优化和字体处理](#base64)
* [webpack的配置进行合并和提取公共配置](#webpackMerge)
* [启动监控自动编译和启用js的sourcemap](#jsSourcemap)
* [热更新和代理配置](#hot)
* [bable转换及优化](#bable)
* [eslint配置](#eslint)
* [模块解析后缀和别名配置](#resolve)
* [模块的外部依赖配置](#externals)
* [打包分析报表插件与优化总结](#analyzer)


# demo入门
<span id="start"></span>
* 安装webpack：
```js
npm install --save-dev webpack webpack-cli
```

* 项目根目录下新建webpack.config.js配置文件，添加如下配置：
```js
var path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/', //在打包后的文件路径前加前缀,/表示根路径
        filename: 'main.js'
    },
    module: {
        rules: []
    },
}
```

* 在项目根目录下的package.json文件添加js脚本命令：
```js
"scripts": {
    "dev": "webpack --config webpack.config.js"
}
```
在终端运行 npm run dev验证webpack配置是否成功。

# webpack处理css/less/sass模块
<span id="css"></span>
安装css/less/scss相关loader：
```js
npm i -D css-loader postcss-loader style-loader //处理css
npm i -D sass-loader node-sass //处理scss
```
在webpack.config.js配置文件添加如下配置：
```js
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.(scss|sass|css)$/,
                use:['style-loader','css-loader', 'postcss-loader', 'sass-loader']
            }
        ]
    },
}
```

# webpack的css添加c3前缀和sourcemap
<span id="cssSourcemap"></span>
1、追踪css样式的最终文件位置，在css-loader开启sourceMap配置
```js
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.(scss|sass|css)$/,
                use:['style-loader',{
                    loader:'css-loader',
                    options: {
                        sourceMap: true //开启，追踪css样式的文件位置
                    }
                }, {
                    loader:"postcss-loader",
                    options: {
                        sourceMap: true
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
}
```

2、postcss是一个对css进行预处理的平台，可以添加前缀
```js
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.(scss|sass|css)$/,
                use:['style-loader','css-loader', {
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
}
```


# webpack的css提取成单独文件
<span id="MiniCssExtractPlugin"></span>
webpack4使用插件mini-css-extract-plugin
在生产环境抽离css,所以在webpack.prod.js文件添加配置：
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//把css抽离成单独文件，webpack4版本使用这个插件
module.exports = merge(base, {
    module: {
        rules: [
            {
                test: /\.(scss|sass|css)$/,
                use:[{
                    loader: MiniCssExtractPlugin.loader,//添加插件loader
                },'css-loader',{
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
        new MiniCssExtractPlugin({ //添加文件名配置
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ]
})

```


# webpack压缩css和js
<span id="optimize"></span>
webpack4使用optimize-css-assets-webpack-plugin插件压缩css文件
```js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css文件

module.exports = merge(base, {
    plugins:[
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g, //匹配要压缩的css文件
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
              preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
    ]
})
```


# webpack文件的hash值
<span id="hash"></span>
在生产环境中为了避免缓存，往往通过给打包文件添加hash值
用到html-webpack-plugin插件生成模板html文件，并将带有hash值的css和js文件自动添加到html模板文件


# webpack清理打包目录文件
<span id="clean"></span>
用插件clean-webpack-plugin清理dist目录
安装：
```js
npm i -D clean-webpack-plugin
```
配置：
```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//打包前清理目录文件

module.exports = merge(base, {
    plugins:[
        //...
        new CleanWebpackPlugin(), //清理dist文件夹下所有文件，需放在最后一个
    ],
})

```

# 图片的优化处理
<span id="base64"></span>
1、引入file-loader+image-webpack-loader处理图片
```js
rules: [{
  test: /\.(gif|png|jpe?g|svg)$/i,
  use: [
    'file-loader',
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        // optipng.enabled: false will disable optipng
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: '65-90',
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        },
        // the webp option will enable WEBP
        webp: {
          quality: 75
        }
      }
    },
  ],
}]
```

图片优化处理-图片压缩，使用插件image-webpack-loader对图片压缩优化
备注：file-loader和url-loader的区别：
* file-loader返回的是图片的url
* url-loader可以对图片进行base64处理，减少图片请求从而提高性能，当图片小于limit(单位：byte)大小时转base64，大于limit时调用file-loader对图片进行处理。
* url-loader内部封装了file-loader，但并不依赖file-loader

2、使用url-loader处理图片
```js
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
```


# webpack的配置进行合并和提取公共配置
<span id="webpackMerge"></span>
用到插件webpack-merge
把webpack.config.js文件划分成三个配置文件，分别是
* 公共配置文件webpack.base.js
entry选项配置
module选项中保留对js的打包处理、对图片的处理
plugins选项中保留对html模板文件的处理
externals外部依赖处理
resolve解析配置

* 生产环境配置文件webpack.prod.js
output 需要hash
css要提取成单独文件，并且要压缩，不需要开启sourcemap，移除冗余css文件
plugins选项，打包前要清理文件

* 开发环境配置文件webpack.dev.js
output 不需要hash
css要开启sourcemap
webpack-dev-server打包文件在内存中，不生成dist目录，所以不需要清理文件

修改package.json文件脚本命令：
```js
"scripts": {
    "dev": "webpack-dev-server --open --hot --config ./webpack/webpack.dev.js --mode development",
    "start": "node server/index.js",
    "build": "webpack --config ./webpack/webpack.prod.js --mode production"
}
```
本地开发运行：npm run dev
生产打包运行：npm run build
起noode服务运行：npm run start


# webpack的启动监控自动编译和启用js的sourcemap
<span id="jsSourcemap"></span>
* webpack4默认启动js的sourcemap,可以通过inline-source-map选项，找到js出错的原始位置（不要用于生产环境）：
```js
devtool:'inline-source-map',//开发环境启动js的sourcemap
```

启动自动编译：
* 方法一，启动webpack增加--watch参数，自动打包，但需要手动刷新浏览器
```
webpack --watch
```
* 另一种办法：使用webpack-dev-server，能够实时重新加载更新浏览器


# webpack的启动热更新和代理配置
<span id="hot"></span>
webpack-dev-server能够用于快速开发应用程序，直接在内存中编译，能够实时重新加载更新浏览器。
* 启动热更新配置hot选项：
```js
module.exports = {
  //...
  devServer: {
    contentBase:path.join(__dirname, '../dist'),//启动服务的资源文件目录
    port:9000,
    hot:true//是否启动热更新
  }
};
```
注意，在devServer里配置的hot,必须有 webpack.HotModuleReplacementPlugin 才能完全启用 HMR。如果 webpack 或 webpack-dev-server 是通过 --hot 选项启动的，那么这个插件会被自动添加，所以你可能不需要把它添加到 webpack.config.js 中
* 代理通过proxy选项配置
```js
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
};
```
请求到 /api/users 现在会被代理到请求 http://localhost:3000/api/users
如果你不想始终传递 /api ，则需要重写路径：
```js
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api' : ''}
      }
    }
  }
};
```
如果你想要代理多个路径特定到同一个 target 下，你可以使用由一个或多个「具有 context 属性的对象」构成的数组：
```js
module.exports = {
  //...
  devServer: {
    proxy: [{
      context: ['/auth', '/api'],
      target: 'http://localhost:3000',
    }]
  }
};
```


# webpack的bable转换及优化
<span id="bable"></span>
* 安装以下工具
```js
npm install babel-loader babel-core babel-preset-env
```
使用：
```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}
```
在项目根目录下新建一个.babelrc配置文件，文件中配置如下：表示有最新的语法都进行转码
```js
{
    "presets": ["@babel/preset-env"]
}
```
bable转换编译很慢，可以从下面方法进行优化：
* 配置选项cacheDirectory使用缓存结果
```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        cacheDirectory: true //指定的目录将用来缓存 loader 的执行结果，提高
      }
    }
  ]
}
```
* 当项目文件较大时，cacheDirectory效果不明显，以下优化可以加快编译打包速度。
安装工具：
```js
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```
使用：在.babelrc配置文件添加配置：
```js
{
    //...
    "plugins": [
        [
          "@babel/plugin-transform-runtime",
          {
            "absoluteRuntime": false,
            "corejs": false,
            "helpers": true,
            "regenerator": true,
            "useESModules": false
          }
        ]
    ]
}
```


# webpack的eslint校验配置
<span id="eslint"></span>
* 安装eslint工具：
```js
npm install eslint-loader eslint --save-dev
npm install babel-eslint --save-dev
```

* 使用：添加在rules数组的最后添加eslint-loader，fix选项可以配置自动修复eslint语法检查。
```js
module.exports = {
    module: {
        rules: [
            {
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
            }
        ]
    },
}
```

在项目根目录下添加.eslintrc配置文件，配置语法规范。
```js
{
    "parser": "babel-eslint",
    "rules": {
        "semi": ["off", "always"],
        "quotes": ["error", "double"]
    }
}
```

在项目根目录下添加.eslintignore文件，配置忽略语法检查的文件和目录
```js
/dist/
/node_modules/
/*.js
```
/*.js 表示忽略根目录下的所有js文件


# webpack的模块解析后缀和别名配置
<span id="resolve"></span>
* 解析（resolve）
resolve配置模块如何解析。resolve的这些选项能设置模块如何被解析。webpack 提供合理的默认值
* resolve.alias 配置别名
```js
module.exports = {
  //...
  resolve: {
    alias: {
        '@': path.resolve(__dirname, 'src/'), //src目录对应别名是@符号
        Utilities: path.resolve(__dirname, 'src/utilities/'),
        Templates: path.resolve(__dirname, 'src/templates/')
    }
  }
};
```
现在，替换「在导入时使用相对路径」这种方式，就像这样：
```js
//import Utility from '../../utilities/utility';
import Utility from 'Utilities/utility';
```

* resolve.extensions  配置扩展名
```js
module.exports = {
  //...
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json']
  }
};
```
能够使用户在引入模块时不带扩展：
```js
import File from '../path/to/file';
```


# webpack的模块的外部依赖配置
<span id="externals"></span>
* 外部扩展(externals)
externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法。
防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。


# webpack的打包分析报表插件与优化总结
<span id="analyzer"></span>
安装webpack打包的分析工具，用于生产打包文件报表，分析打包依赖和文件大小等信息，以便优化webpack配置。
```js
npm install --save-dev webpack-bundle-analyzer
```

使用：在开发环境中使用：
```js
module.exports = {
    //...
    plugins:[
        new BundleAnalyzerPlugin() //调用插件
    ]
};
```
配置完毕重新运行npm run dev，会自动打开一个网址，我的是http://localhost:8888/，网页内容就是文件打包报表，可以看到打包依赖关系。
