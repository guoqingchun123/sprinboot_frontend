'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const port = 8080

module.exports = {
    publicPath: process.env.VUE_APP_ROOT || '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV !== 'production',
    productionSourceMap: false,
    devServer: {
        port: port,
        proxy: {
            '/api': {
                target: `http://localhost:${port}/mock`,
                changeOrigin: true,
                pathRewrite: {
                '^/api': ''
                }
            }
        },
        after(app) {
            const bodyParser = require('body-parser')
            require('@babel/register')
            // parse app.body
            // http://expressjs.com/en/4x/api.html#req.body
            app.use(bodyParser.json())
            app.use(bodyParser.urlencoded({ extended: true }))
      
            // import ES2015 module from common.js module
            const { default: mocks } = require('./mock')
            for (const mock of mocks) {
              app.all(mock.route, mock.response)
            }
        }
    },
    configureWebpack: {
        // We provide the app's title in Webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: 'oa',
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
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
    }
}
