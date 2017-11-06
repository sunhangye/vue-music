### 一、webpack核心原理
#### 1. 一切皆模块
正如js文件可以是一个“模块（module）”一样，其他的（如css、image或html）文件也可视作模 块。因此，你可以require('myJSfile.js')亦可以require('myCSSfile.css')。这意味着我们可以将事物（业务）分割成更小的易于管理的片段，从而达到重复利用等的目的。
#### 2. 按需加载
Webpack使用许多特性来分割代码然后生成多个“bundle”文件，而且异步加载部分代码以实现按需加载。

### 二、vue-cli中wabpack模板项目配置文件解析
##### 目录结构
```
├─build
│   ├─build.js
│   ├─check-versions.js
│   ├─dev-client.js
│   ├─dev-server.js
│   ├─utils.js
│   ├─vue-loader.conf.js
│   ├─webpack.base.conf.js
│   ├─webpack.dev.conf.js
│   ├─webpack.prod.conf.js
│   └─webpack.test.conf.js
├─config
│   ├─dev.env.js
│   ├─index.js
│   ├─prod.env.js
│   └─test.env.js
├─...
└─package.json
```
### 三、指令分析
```
"scripts": {
	"dev": "node build/dev-server.js",
	"start": "node build/dev-server.js",
	"build": "node build/build.js"
}
```
直接看”dev”和”build”。运行”npm run dev”的时候执行的是build/dev-server.js文件，运行”npm run build”的时候执行的是build/build.js文件，我们可以从这两个文件开始进行代码阅读分析。
### 四、build文件解析
#### build/dev-server.js
首先来看执行”npm run dev”时候最先执行的build/dev-server.js文件。该文件主要完成下面几件事情：
1. 检查node和npm的版本、引入相关插件和配置
2. webpack对源码进行编译打包并返回compiler对象
3. 创建express服务器
4. 配置开发中间件（webpack-dev-middleware）和热重载中间件（webpack-hot-middleware）
5. 挂载代理服务和中间件
6. 配置静态资源
启动服务器监听特定端口（8080）
7. 自动打开浏览器并打开特定网址（localhost:8080）
<br />
<br />
** 说明：** express服务器提供静态文件服务，不过它还使用了http-proxy-middleware，一个http请求代理的中间件。前端开发过程中需要使用到后台的API的话，可以通过配置proxyTable来将相应的后台请求代理到专用的API服务器。
<br />

```

// 检查nodejs和npm版本
require('./check-versions')()

// 获取基本配置
var config = require('../config')
// 如果Node的环境变量中没有设置当前的环境NODE_ENV，则使用config中的dev环境配置为当前配置
// process模块用来与当前进程互动，可以通过全局变量process访问，不必使用require命令加载。它是一个EventEmitter对象的实例。
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

// opn是一个可以调用默认软件打开网址、图片、文件等内容的插件
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
// http-proxy-middleware是一个express中间件，用于将http请求代理到其他服务器
// 例：localhost:8080/api/xxx  -->  localhost:3000/api/xxx
// 这里使用该插件可以将前端开发中涉及到的请求代理到提供服务的后台服务器上，方便与服务器对接
var proxyMiddleware = require('http-proxy-middleware')
// 开发环境下webpack配置
var webpackConfig = require('./webpack.dev.conf')

// dev-server监听的端口号，如果没有在命令行中传入端口号，则使用config.dev.port配置的端口号
var port = process.env.PORT || config.dev.port
// 用于判断是否要自动打开浏览器的布尔值，当配置文件中没有设置自动打开浏览器的时候其值为 false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// HTTP代理表，指定规则，将某些API请求代理到相应的服务器
var proxyTable = config.dev.proxyTable

// 创建express服务器
var app = express()

// webpack根据配置开始编译打包源码并返回compiler对象
var compiler = webpack(webpackConfig)

// webpack-dev-middleware将webpack编译打包后得到的产品文件存放在内存中而没有写进磁盘
// 将这个中间件挂到express上使用之后即可提供这些编译后的产品文件服务
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath, // 设置访问路径为webpack配置中的output里面所对应的路径
  quiet: true // 设置为true，使其不要在控制台输出日志
})

// webpack-hot-middleware，用于实现热重载功能的中间件
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false, // 关闭控制台的日志输出
  heartbeat: 2000 // 发送心跳包的频率
})

// webpack(重新)编译打包完成后并将js、css等文件inject到html文件之后，通过热重载中间件强制页面刷新
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
		hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// 根据 proxyTable 中的代理请求配置来设置express服务器的http代理规则
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
		// 格式化options，例如将'www.example.com'变成{ target: 'www.example.com' }
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// 重定向不存在的url，用于支持SPA
// 例如使用了vue-router，并开启了history模式
app.use(require('connect-history-api-fallback')())

// 挂载webpack-dev-middleware中间件，提供webpack编译打包后的产品文件服务
app.use(devMiddleware)

// 挂载热重载中间件
app.use(hotMiddleware)

// serve pure static assets
// 提供static文件夹上的静态文件服务
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

// 访问链接
var uri = 'http://localhost:' + port

// 创建promise，在应用服务启动之后resolve
// 便于外部文件require了这个dev-server之后的代码编写
var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
// webpack-dev-middleware等待webpack完成所有编译打包之后输出提示语到控制台，表明服务正式启动
// 服务正式启动才自动打开浏览器进入页面
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

// 启动express服务器并监听相应的端口
var server = app.listen(port)

// 暴露本模块的功能给外部使用，例如下面这种用法
// var devServer = require('./build/dev-server')
// devServer.ready.then(() => {...})
// if (...) { devServer.close() }
module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
```
#### build/webpack.base/conf.js

从代码中看到，dev-server使用的webpack配置来自build/webpack.dev.conf.js文件（测试环境下使用的是build/webpack.prod.conf.js，这里暂时不考虑测试环境）。而build/webpack.dev.conf.js中又引用了webpack.base.conf.js，所以这里我先分析webpack.base.conf.js。
<br />
webpack.base.conf.js主要完成了下面这些事情：

1. 配置webpack编译入口
2. 配置webpack输出路径和命名规范
3. 配置模块resolve规则
4. 处理不同类型模块的处理规则
<br />
** 说明：** 这个配置里面只配置了.js、.vue、图片、字体等几类文件的处理规则，如果需要处理其他文件可以在module.rules里面另行配置。

```
// 获取文件绝对路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
	// webpack入口文件
  entry: {
    app: './src/main.js'
  },
	// webpack 输出路径和命名规则
  output: {
		// webpack输出的目标文件夹路径（例如：/dist）
    path: config.build.assetsRoot,
		// webpack输出bundle文件命名格式
    filename: '[name].js',
		// webpack编译输出的发布路径（例如'//cdn.xxx.com/app/'）
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
	// 模块resolve的规则
  resolve: {
    extensions: ['.js', '.vue', '.json]
		// 别名，方便引用模块，例如有了别名之后，
    alias: {
      'vue$': 'vue/dist/vue.min.js',
      '@': resolve('src'),
      'common': resolve('src/common'),
      'components': resolve('src/components'),
      'api': resolve('src/api'),
      'base': resolve('src/base'),
    },
    symlinks: false
  },
  module: {
    rules: [
      {// 对所有.vue文件使用vue-loader进行编译
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {// 对src和test文件夹下的.js文件使用babel-loader将es6+的代码转成es5
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {// 对图片资源文件使用url-loader
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {// 对多媒体资源文件使用url-loader
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {// 对字体资源文件使用url-loader
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
					// 小于10K的资源转成base64编码的dataURL字符串写到代码中
          limit: 10000,
					// 其他的资源转移到静态资源文件夹
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
       }
      // {
      // test: /\.vue$/,
      // loader: 'vue-loader',
      // options: {
      //     // vue-loader options go here
      //     postcss: [require('autoprefixer')({ browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8'] })]
      //   }
      // }
    ]
  }
}
```
#### build/webpack.dev.conf.js
接下来看webpack.dev.conf.js，这里面在webpack.base.conf的基础上增加完善了开发环境下面的配置，主要包括下面几件事情：
1. 将webpack的热重载客户端代码添加到每个entry对用的应用
2. 合并基础的webpack配置
3. 配置样式文件的处理规则，styleLoaders
4. 配置 sourceMap
5. 配置webpack插件
<br />
** 详见代码注释 **

```
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
// webpack-merge是一个合并数组和对象的插件
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
// html-webpack-plugin用于将webpack编译打包后的产品注入到html模板中
// 即自动在index.html中加上<link>和<scripts>引用webpack打包后的文件
var HtmlWebpackPlugin = require('html-webpack-plugin')
// friendly-errors-webpack-plugin用于更友好地输出webpack的警告、错误等信息
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

//给每个入口页面加上dev-client,用于跟dev-server的热重载插件通信，实现热更新
Object.keys(baseWebpackConfig.entry).forEach(function(name){
	baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
	})

module.exports = merge(baseWebpackConfig, {
	module: {
		// 样式文件的处理规则，对css/sass/scss等不同内容使用相应的styleLoaders
		rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap})
	},
	devtool: '#cheap-module-eval-source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': config.dev.env
		}),
		// 开启webpack热更新功能
		new webpack.HotModuleReplacementPlugin(),
		// webpack编译过程中出错的时候跳过报错阶段，不会阻塞编译，在编译结束后报错
		// 自动将依赖注入html模板，并输出最终的html文件到目标文件夹
    new webpack.NoEmitOnErrorsPlugin(),

	]
})
```

### build/utils.js
