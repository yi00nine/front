###### 基本概念

- entry:入口文件
- module: 在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块
- chunk:一个 Chunk 由多个模块组合而成，用于代码合并与分割
- loader:webpack 本身只处理 js,json 文件,需要 loader 来帮助处理更多格式的文件
- plugin

###### webpack 执行的流程

- 初始化参数,从 shell 语句中和配置文件中读取并且合并参数
- 用得到的初始化参数初始化 compiler 对象,加载所有配置的插件,开始编译
- 确定入口文件,根据配置的 entry 找到所有的入口文件
- 编译模块,从入口文件开始,调用配置的 loader 对模块进行翻译,再找出该模块依赖的模块,进行递归
- 模块编译完成,得到了每个模块翻译之后的内容,并且每个模块的依赖关系
- 根据入口文件和每个模块的关系,组装成 chunk 文件,再把每个 Chunk 转换成一个单独的文件加入到输出列表
- 确定好输出的内容,根据 output 配置的路径输出

###### 编写一个 loader

- Loader 其实就是一个 Node.js 模块，这个模块需要导出一个函数。 这个导出的函数的工作就是获得处理前的原内容，对原内容执行处理后，返回处理后的内容
- 获取 loader 中传递的 option,
  ```js
  loaderUtils.getOptions(this)
  return source
  ```
- 返回除了原内容之外的东西

```js
this.callback(null, source, sourceMap)
return
```

- 处理二进制数据,默认情况下,webpack 传递给 loader 的书就是 utf-8 的字符串.有些场景下需要处理二进制文件,通过 exports.raw 告诉 webpack 返回的是二进制数据

```js
module.exports.raw = true
```

- 如何加载本地的 loader
  - 通过 npm link 来进行软连接
  - 在 webpack 中配置 resolveLoader

###### 编写一个 plugin

- webpack 插件是一个具有 apply 方法的 js 对象,webpack 在启动的时候,会先初始化一个 basicPlugin 的实例,在调用实例的 apply 方法传入 compile 对象,插件实例获取到 compiler 对象之后可以监听 webpack 的一些事件来做相应的操作

```js
const BasicPlugin{
  apply(compiler){
    compiler.plugin('compilation',function(compilation) {})
  }
}
```

- compiler 和 compilation 是 plugin 和 webpack 之间通信的关键
  - compiler 包含了 webpack 所有的配置信息,compiler 是在 webpack 启动的时候被实例化,全局唯一
  - compilation 对象包含了当前的模块资源,编译生成的资源.以开发模式运行的时候,每当监测到一个文件变化,一个新的 compilation 将被创建
- 事件流,webpack 通过 tapable 来组织事件流, 应用了观察者模式,和 node 中的 EventEmitter 非常相似,compiler 和 compilation 都继承 tapable,可以直接在这两个对象广播和监听事件

```js
//广播出事件
compiler.apply('event-name', params)
//监听事件
compiler.plugin('event-name', function () {})
```
