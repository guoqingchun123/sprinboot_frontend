'use strict'
const path = require('path')
const pkg = require('./package.json')

const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

process.env.VUE_APP_VERSION = pkg.version

// 系统代码
process.env.VUE_APP_CODE = 'hmis'
// id不同的详情页是否允许同时打开多个
process.env.VUE_APP_DETAIL_SEPRATE = false

const name = pkg.name || 'hmis' // page title
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
const port = 8080

let proxy = {
}
if (process.env.VUE_APP_ANALYSIS === 'true') {
  proxy['/track'] = {
    target: process.env.VUE_APP_TRACK_HOST,
    changeOrigin: true,
    pathRewrite: {
      '^/track': ''
    }
  }
}
if (process.env.VUE_APP_MOCK !== 'true') {
  proxy['/hmis/api'] = {
    target: process.env.VUE_APP_API_SERVER,
    changeOrigin: true,
    pathRewrite: {
      '/hmis/api': '/api'
    }
  }
  proxy['/api'] = {
    target: process.env.VUE_APP_API_PORTAL,
    changeOrigin: true
  }
  proxy['/file/view/'] = {
    target: process.env.VUE_APP_FILE_SERVER,
    changeOrigin: true,
    pathRewrite: {
      '^/file/view': ''
    }
    /*onProxyRes(proxyRes, req, res) {
      console.log(req)
      // res.header('Access-Control-Allow-Origin', 'http://www.domain1.com')
      res.header('Access-Control-Allow-Credentials', 'true')
    }*/
  }
  proxy['/drivers'] = {
    target: process.env.VUE_APP_DRIVER_SERVER,
    changeOrigin: true
  }
  proxy['/socket'] = {
    target: process.env.VUE_APP_SOCKET_SERVER,
    changeOrigin: true,
    ws: true
  }
} else {
  // change xxx-api/login => mock/login
  // detail: https://cli.vuejs.org/config/#devserver-proxy
  proxy['/api'] = {
    target: `http://localhost:${port}/mock`,
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  }
}

let plugins = [
]

module.exports = {
  publicPath: process.env.VUE_APP_ROOT || '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: process.env.VUE_APP_ERRORLOG !== 'false',
  // transpileDependencies: ['@bestvike'],
  devServer: {
    port: port,
    // open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: proxy,
    after: process.env.VUE_APP_MOCK !== 'true' ? undefined : require('./mock/mock-server.js')
  },
  configureWebpack: {
    // We provide the app's title in Webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: plugins,
    module: {
      rules: [
        {
          test: /[\\/]assets[\\/]help(.*)/ ,
          use: [
            'file-loader'
          ],
        }
      ]
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    //忽略/moment/locale下的所有文件
    config.plugin('ignore').use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'production',
        // https://webpack.js.org/configuration/devtool/#development
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV === 'production',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                }
              }
          })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
