import { reactive } from './effect.js'
export function ref(value) {
  const wrapper = {
    value,
  }
  Object.defineProperty(wrapper, '__isRef', {
    value: true,
  })
  return reactive(wrapper)
}

function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key]
    },
    set value(val) {
      obj[key] = val
    },
  }
}

function toRefs(obj) {
  const ret = {}
  for (const key in obj) {
    ret[key] = toRef(obj, key)
  }
  return ret
}
