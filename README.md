# 从零开始搭建webpack项目
# 配置笔记
一、遇到的问题
* 1、webpack4热更新，在没有配置热更新插件和其他DevServe属性时，已经自动支持热更新了？
原因：--hot参数就是热更新，等价于在DevServe中配置热更新属性
```
 "dev": "webpack-dev-server --config ./webpack/webpack.dev.js --open --hot",
 参数--hot等价于：
 devServer: {
    hot:true
 },
```
* 2、在打包文件前清除dist文件夹，为什么dist目录文件加下没有文件生成，项目却可以运行？
原因：webpack-dev-server命令会在内存中中生成打包文件直接运行打包文件，并不会生成dist目录。所以只有生产环境才需要生成dist目录，生产环境配置npm run build命令。
* 3、图片打包，url-loader，在css、less/sass中配置publicPath并没有生成img文件夹？img标签中的图片并没有打包？
解答：
①webpack-dev-server命令不会生成dist目录而是在内存中生成文件夹；
②publicPath一般只需要在output里面配置用到，顶多DevServe中有用到，其他地方用不到
③在css文件中的background图片会打包，是否打包到dist/images文件夹，受url-loader的属性limit大小限制， 小于限制不会打包
④ 在html标签比如img标签中的图片没有被打包，是因为我把img标签写在了项目入口文件index.html文件中，而这个文件恰好不会被编译，所以没有打包。正常写在vue文件中是会被编译所以能被打包。
* 4、autoprefixer遇到browsers报错，原因是版本问题，browsers换成overrideBrowserslist就OK了
————————————————————————————————————————————————————————————————
* 5、webpack.prod.js的rules如何与webpack.base.js的rules合并，先后顺序？
* 6、webpack自动对js文件进行了压缩？没有使用js压缩插件uglifyjs-webpack-plugin前就已经是压缩的代码了


二、新学到的知识点
1、分离webpack配置文件，--config参数的作用
* package.json文件配置脚本命令，webpack命令默认会执行项目更目录下的webpack.config.js文件，当需要执行特定目录下自定义的webpack配置文件时，用--config参数加配置文件目录即可
```js
 "scripts": {
    "dev": "webpack-dev-server --config ./webpack/webpack.dev.js --open --hot",
    "build:dev": "webpack --config ./webpack/webpack.dev.js --progress",
    "build": "webpack --config ./webpack/webpack.prod.js --progress",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

2、webpack.base,dev,prod三个配置文件的区别
* dev主要配置本地开发DevServe，source-map配置用于跟踪错误代码
* base主要配置公共的打包，loader，
* prod主要配置打包前清理dist文件夹，

3、学习方法，从bilibili网站找课程学习更佳高效
https://www.bilibili.com/video/av41546218?from=search&seid=12004938586640822102