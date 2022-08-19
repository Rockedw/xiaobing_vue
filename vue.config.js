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
    }
  },
})
