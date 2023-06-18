const webpackCommonConfig = require('./wepack.common.js')('development')

module.exports = {
  devServer: {
    host: 'localhost',
    port: '7777',
    open: true, //服务器已经启动后打开浏览器
    hot: true, //启用 webpack 的 热模块替换 特性
    compress: true, //启用gzip
    proxy: {
      //代理
    },
  },
  ...webpackCommonConfig,
}
