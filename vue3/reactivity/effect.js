let activeEffect //定义全局的副作用函数
const effectStack = [] //解决effect嵌套问题

const bucket = new WeakMap() //weakMap 对key 是弱引用,不影响垃圾回收.

const ITERATE_KEY = Symbol() //对 for in 循环做响应式兼容

export function effect(fn, options = {}) {
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
  if (!options.lazy) {
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

export function trigger(target, key, type) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const iterateEffects = depsMap.get(ITERATE_KEY)
  const effectsToRun = new Set()
  effects &&
    effects.forEach((el) => {
      if (el !== activeEffect) {
        effectsToRun.add(el)
      }
    })
  if (type === 'ADD' || type === 'DELETE') {
    //当值时新增或者删除的时候触发
    iterateEffects &&
      iterateEffects.forEach((el) => {
        if (el !== activeEffect) {
          effectsToRun.add(el)
        }
      })
  }
  effectsToRun.forEach((effectFn) => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
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

function createReactive(data, isShallow = false) {
  return new Proxy(data, {
    get(target, key, receiver) {
      track(target, key)
      const res = Reflect.get(target, key, receiver)
      if (isShallow) {
        return res
      }
      if (typeof res === 'object' && res !== null) {
        return reactive(res)
      }
      return res
    },
    set(target, key, newVal, receiver) {
      const oldValue = target[key]

      const type = Object.prototype.hasOwnProperty.call(target, key)
        ? 'SET'
        : 'ADD'
      const res = Reflect.set(target, key, newVal, receiver)
      if (oldValue !== newVal) {
        trigger(target, key, type)
      }
      return res
    },
    has(target, key) {
      track(target, key)
      return Reflect.has(target, key)
    },
    ownKeys(target) {
      track(target, ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    deleteProperty(target, key) {
      const hasKey = Object.prototype.hasOwnProperty.call(target, key)
      const res = Reflect.defineProperty(target, key)
      if (res && hasKey) {
        trigger(target, key, 'DELETE')
      }
      return res
    },
  })
}

export function reactive(data) {
  return createReactive(data)
}

export function shallowReactive(data) {
  return createReactive(data, true)
}
