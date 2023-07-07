let activeEffect //定义全局的副作用函数
const effectStack = [] //解决effect嵌套问题

const bucket = new WeakMap() //weakMap 对key 是弱引用,不影响垃圾回收.

export function effect(fn,options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(activeEffect)
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return res
  }
  effectFn.deps = [] //存放当前副作用函数的依赖集合
  effectFn.options = options 
  if(!options.lazy){
    effectFn()
  }
  return effectFn
}

export function track(target, key) {
  if (!activeEffect) return target[key]
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

export function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const effectsToRun = new Set()
  effects &&
    effects.forEach((el) => {
      if (el !== activeEffect) {
        effectsToRun.add(el)
      }
    })
  effectsToRun.forEach((effectFn) => {
    if(effectFn.options.scheduler){
      effectFn.options.scheduler(effectFn)
    }else{
      effectFn()
    }
  })
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

export function myProxy(data) {
  return new Proxy(data, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, newVal) {
      target[key] = newVal
      trigger(target, key)
      return true
    },
  })
}
