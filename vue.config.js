const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#5b88c8',
          },
          javascriptEnabled: true,
        },
      },
    },
},
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  productionSourceMap: false,
  transpileDependencies: true,
  lintOnSave: false,
  devServer:{
    host: '0.0.0.0',
    port:8082,
    client: {
      webSocketURL: 'ws://0.0.0.0:8082/ws',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
          target: 'http://39.105.6.98:43000/api/',//这里后台的地址模拟的;应该填写你们真实的后台接口
          ws: true,
          changOrigin: true,//允许跨域
          pathRewrite: {
              '^/api': ''//请求的时候使用这个api就可以
          }
        },
        '/test': {
          target: 'http://39.105.6.98:43081/test',//这里后台的地址模拟的;应该填写你们真实的后台接口
          ws: true,
          changOrigin: true,//允许跨域
          pathRewrite: {
              '^/test': ''//请求的时候使用这个api就可以
          }
        },
      
    }


  }
})
