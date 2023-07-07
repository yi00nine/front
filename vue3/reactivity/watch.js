import { effect } from './effect.js'
export function watch(source, cb, options = {}) {
  let getter, oldValue, newValue
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  let cleanup
  function onInvalidate(fn) {
    cleanup = fn
  }
  const job = () => {
    newValue = effectFn()
    if (cleanup) {
      cleanup()
    }
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }
  const effectFn = effect(() => getter(), {
    scheduler: job,
    lazy: true,
  })
  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}

function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return // 只考虑对象的情况
  seen.add(value)
  for (const key in value) {
    traverse(value[key], seen)
  }
  return value
}
