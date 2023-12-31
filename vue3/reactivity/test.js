import { reactive, effect } from './effect.js'
import { computed } from './computed.js'
import { watch } from './watch.js'
import { ref } from './ref.js'
const data = {
  //原始数据
  ok: true,
  text: 11,
  a: 1,
  b: 2,
  c: {
    d: 1,
  },
}
const obj = reactive(data)
const refVal = ref(1)
/**
 * 测试代码
 */

effect(() => {
  let a = refVal.value
  console.log(a)
})
// effect(() => {
//   let a = obj.a
//   console.log(a)
// })

setTimeout(() => {
  refVal.value = 2 //不应该触发响应式更新
}, 300)

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
// watch(
//   () => obj.a,
//   (a, b) => {
//     console.log(1, a, b)
//   },
//   {
//     immediate: true,
//   }
// )

// obj.a = 111

/**
 * ref
 */
