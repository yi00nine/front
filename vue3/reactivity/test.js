import { myProxy, effect } from './effect.js'
import { computed } from './computed.js'
import { watch } from './watch.js'
const data = {
  //原始数据
  ok: true,
  text: 11,
  a: 1,
  b: 2,
}
const obj = myProxy(data)
/**
 * 测试代码
 */

// effect(() => {
//   let a = obj.ok ? obj.text : '1'
//   console.log(a)
// })

// setTimeout(() => {
//   obj.ok = false
// }, 1000)

// setTimeout(() => {
//   obj.text = 222 //不应该触发响应式更新
// }, 3000)

/**
 * effect 嵌套场景
 */

// effect(() => {
//   console.log('外层执行')
//   effect(() => {
//     console.log('内层执行', obj.text)
//   })
//   console.log(obj.ok)
// })

// setTimeout(() => {
//   obj.text = 111
// }, 1000)

/**
 * 递归情况
 */

// effect(() => {
//   obj.text++
//   console.log(111)
// })

/**
 * 调度器
 */

// effect(()=>{
//   console.log(obj.text)
// },{
//   scheduler(fn){
//     setTimeout(fn, 1000);
//   }
// })
// obj.text = 'hi'
// console.log('end')

/**
 * 计算属性
 */

// const res = computed(()=>obj.a + obj.b)
// effect(()=>{
//   console.log(res.value)
// })
// obj.a = 4

/**
 * 监听
 */
watch(
  () => obj.a,
  (a, b) => {
    console.log(1, a, b)
  },
  {
    immediate: true,
  }
)

obj.a = 111
