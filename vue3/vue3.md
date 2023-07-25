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
- Reflect是一个全局的对象,通过 `Reflect.get(target.key,receiver)`来代替 `target[key]`的方式直接取值,是因为在进行复合操作的时候,this会指向原始数据,而不是代理对象,因此需要用reflect的第三个参数receiver来指定this

###### compiler

完整的编译过程: 源代码 、词法分析、语法分析、语义分析、中间代码生成、优化、目标代码生成、目标代码(渲染函数)

- 源代码 : vue的模板语法
- 编译器首先对模版进行词法,语法分析得到模板ast
- 优化ast,静态节点的提取,静态属性的提取,静态方法的提取等
- 模板ast转换成javascript ast
- 生成渲染函数,用来生成虚拟dom,在vue中所有的模版语法最后都会变成渲染函数,再通过调用h函数来生成虚拟dom
- 虚拟dom通过渲染器渲染到页面上

```js
//源代码
<div>
  <h1>hello</h1>
</div>
//转换之后的代码
function render(){
   return h('div',[
    h('h1',{},'hello')
   ])
}
```

###### renderer

- renderer.render函数接受虚拟dom作为参数,通过diff算法来比较新旧的虚拟dom
- 渲染器根据新旧的虚拟dom来执行更新操作,如果节点的props发生变化,调用patchProps方法等
- 更新真实的dom操作,根据最新的虚拟dom对旧的dom进行patchElement操作
- diff算法
  - 简单diff算法:新的一组节点去比较旧的节点,根据key值找可以复用的节点,如果找到了记录该节点的索引位置,该索引记录为最大索引位置,在更新的过程中一个节点的索引值小于最大索引代表这个节点对应的真实dom需要移动
  - 双端diff:设置四个索引指向新旧两组节点的端点,下标分别为oldStart,oldEnd,newStart,newEnd,每一轮比较分为四步,直到oldStart 大于 oldEnd 或者 newStart 大于 newEnd
    - 第一步比较旧节点中的oldStart和新节点中的newStart,不需要移动dom,只需要patch就可以
    - 第二步比较旧节点中的oldEnd和新节点中的newEnd,由于两个dom都在末尾,所以不需要进行移动,只需要对两个dom进行patch操作,同时更新oldEnd和newEnd的下标值
    - 第三步比较旧节点中的oldStart和新节点中的newEnd,将旧节点的oldStart移动到旧节点odl
    ldEnd的后面,移动完成后更新oldStart的下标值和newEnd的下标值
    - 第四步比较旧节点中的oldEnd和新节点中的newStart,如果key值相同,将旧节点的oldEnd对应的dom移动到旧节点的oldStart前,移动完成后更新oldEnd的下标值和newStart的下标值
  

###### reactive

vue3的响应式原理基于es6的proxy实现,主要流程:

- 在proxy的get,has等方法上通过track函数来收集响应式依赖,通过activeEffect全局变量关联当前的依赖和副作用函数,存放在 `{weakMap:map:set}`这样的数据结构中,weakMap以对象作为key,map以收集的依赖作为key,set中存放的是依赖对应的副作用函数
- 在proxy的set,deleteProperty等方法中触发trigger函数,从上面的weakMap中取出对应的副作用函数来执行
- effect函数:创建响应式的副作用函数,watch和computed方法都是基于effect实现的
- computed原理,通过effect收集依赖.通过effect的第二个配置 lazy :true实现懒加载,同时定义变量dirty,实现缓存策略
- watch原理:利用effect收集依赖,将effect返回的新旧结果保存下来通过毁掉函数暴露出去
