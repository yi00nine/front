###### vue3目录结构

- compiler-core : 核心模块,提供编译器的基础功能
- compiler-dom : 编译器相关模块,提供了将模版编译为渲染函数的Dom版本的功能
- compiler-sfc : 单文件组件编译模块
- compiler-ssr : 服务端渲染
- reactivity : 响应部分
- runtime-core : 核心模块,提供了运行时的基础功能
- runtime-dom : 运行时的相关模块,提供基于dom的渲染功能
- server-render : 服务端渲染
- shared : 工具函数
- size-check
- template-explorer : 编译文件浏览工具
- vue : 入口文件

###### Proxy和Reflect

- Proxy可以创建一个代理的对象,所谓的代理就是指对一个对象基本语义的代理,允许我们拦截和重新定义对象的基本操作
- 非基本操作又叫复合操作,比如说调用一个对象下面的方法
- Reflect是一个全局的对象,通过`Reflect.get(target.key,receiver)`来代替`target[key]`的方式直接取值,是因为在进行复合操作的时候,this会指向原始数据,而不是代理对象,因此需要用reflect的第三个参数receiver来指定this
