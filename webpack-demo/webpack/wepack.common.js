const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') //简化了 HTML 文件的创建，以便为你的 webpack 包提供服务
const { VueLoaderPlugin } = require('vue-loader')
const testPlugin = require('../src/plugins/testPlugin')
module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'
  return {
    mode: webpackEnv,
    entry: './src/main.ts',
    output: {
      clean: true,
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist'),
    },
    devtool: 'cheap-module-source-map',
    cache: {
      type: 'filesystem', // 使用文件缓存
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.vue'],
      alias: {
        src: path.resolve(__dirname, '../src/'),
      }, //配置别名和默认扩展名
    },
    optimization: {
      splitChunks: {
        chunks: 'all', //分割公共代码
      },
      runtimeChunk: 'single', //最小化入口文件体积
    },
    resolveLoader: {
      modules: ['node_modules', './src/loaders'],
    },
    module: {
      //webpack本身只处理js,json文件,需要loader来帮助处理更多格式的文件
      rules: [
        {
          test: /\.css$/i,
          use: [
            isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader', //postcss处理css兼容性
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      'postcss-preset-env',
                      {
                        // 其他选项
                        autoprefixer: {
                          flexbox: 'no-2009',
                        },
                        stage: 3,
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader', //解析vue文件
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          type: 'asset', //静态资源模块解析静态资源
        },
        {
          test: /\.m?ts$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript'], //转译插件的集合
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            {
              loader: 'thread-loader', //开启两个线程进行打包
              options: {
                workers: 2,
                workerParallelJobs: 2,
              },
            },
          ],
        },
        {
          test: /\.(js|ts)$/,
          use: {
            loader: './src/loaders/testLoader.js',
            options: { params: 'test' },
          },
        },
      ],
    },
    plugins: [
      //loader主要处理不同格式的文件,插件的执行范围更广,如压缩文件,资源管理等,
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html'),
      }),
      new MiniCssExtractPlugin(),
      new VueLoaderPlugin(),
      new testPlugin(),
    ],
  }
}
