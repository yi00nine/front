import { ref } from '../reactivity/ref.js'
import { effect } from '../reactivity/effect.js'

const vnode = {
  type: 'div',
  props: {
    id: 'foo',
    onclick: () => {
      alert('clicked')
    },
  },
  children: [
    {
      type: 'p',
      children: 'hello',
    },
  ],
}

function createRenderer(options) {
  const { createElement, setElementText, insert, patchProps } = options
  function render(vnode, container) {
    if (vnode) {
      //patch
      patch(container._vnode, vnode, container)
    } else {
      if (container._vnode) {
        //delete
        unmount(container._vnode)
      }
    }
    container._vnode = vnode
  }
  function mountElement(vnode, container,anchor) {
    const el = (vnode.el = createElement(vnode.type))
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        patch(null, child, el)
      })
    }
    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(key, el, null, vnode.props[key])
      }
    }
    insert(el, container,anchor)
  }
  function patchElement(n1, n2) {
    //todo
    const el = (n2.el = n1.el)
    const newProps = n2.props
    const oldProps = n1.props
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(key, el, oldProps[key], newProps[key])
      }
    }
    for (const key in oldProps) {
      if (!key in newProps) {
        patchProps(key, el, oldProps[key], null)
      }
    }
    patchChildren(n1, n2, el)
  }
  function patch(n1, n2, container,anchor) {
    if (n1 && n1.type !== n2.type) {
      unmount(n1)
      n1 = null
    }
    const { type } = n2
    if (typeof type === 'string') {
      if (!n1) {
        mountElement(n2, container,anchor)
      } else {
        patchElement(n1, n2)
      }
    } else if (typeof type === 'object') {
      //组件
    } else {
    }
  }
  function unmount(vnode) {
    const parent = vnode.el.parentNode
    if (parent) {
      parent.removeChild(vnode.el)
    }
  }
  function patchChildren(n1, n2, container) {
    if (typeof n2.children === 'string') {
      if (Array.isArray(n1.children)) {
        n1.children.forEach((el) => {
          unmount(el)
        })
      }
      setElementText(container, n2.children)
    } else if (Array.isArray(n2.children)) {
      if (Array.isArray(n1.children)) {
        //todo diff
        const oldChildren = n1.children
        const newChildren = n2.children
        const oldLength = n1.children.length
        const newLength = n2.children.length
        let lastIndex = 0

        for (let i = 0; i < newLength; i++) {
          const newVNode = newChildren[i]
          let find = false
          for (let j = 0; j < oldLength; j++) {
            const oldVNode = oldChildren[j]
            if (newVNode.key === oldVNode.key) {
              find = true
              patch(oldVNode, newVNode, container)
              if (j < lastIndex) {
                const preVnode = newChildren[i - 1]
                if (preVnode) {
                  const anchor = preVnode.el.nextSibling
                  insert(newVNode.el, container, anchor)
                }
              } else {
                lastIndex = j
              }
              break // break退出去
            }
          }
          if(!find){
            const preVnode = newChildren[i-1]
            let anchor = null
            if(preVnode){
              anchor = preVnode.el.nextSibling
            }else{
              anchor = container.firstChild
            }
            patch(null,newVNode,container,anchor)
          }
          for (let i = 0; i < oldLength; i++) {
            const oldVnode = oldChildren[i]
            const has = newChildren.find(el=>{
              return el.key === oldVnode.key
            })
            if(!has) unmount(oldVnode)
          }
        }
      } else {
        setElementText(container, null)
        n2.children.forEach((el) => {
          patch(null, el, container)
        })
      }
    } else {
      if (Array.isArray(n1.children)) {
        n1.children.forEach((el) => {
          unmount(el)
        })
      } else if (typeof n1.children === 'string') {
        setElementText(container, '')
      }
    }
  }
  return { render }
}
const renderer = createRenderer({
  createElement(type) {
    return document.createElement(type)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, container, anchor = null) {
    container.insertBefore(el, anchor)
  },
  patchProps(key, el, preVal, nextVal) {
    if (/^on/.test(key)) {
      let invokers = {} //缓存绑定的事件
      el._vei = invokers
      let invoker = invokers[key]
      const name = key.slice(2).toLowerCase()
      if (nextVal) {
        if (!invoker) {
          invoker = el._vei[key] = (e) => {
            if (e.timeStamp < invoker.attached) return
            invoker.value(e)
          }
          invoker.value = nextVal
          invoker.attached = performance.now()
          el.addEventListener(name, invoker)
        } else {
          invoker.value = nextVal
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker)
      }
    } else if (key === 'class') {
    } else {
      if (key in el) {
        if (nextVal === '') {
          el[key] = true
        } else {
          el[key] = nextVal
        }
      } else {
        el.setAttribute(key, nextVal)
      }
    }
  },
})

// renderer.render(vnode, document.getElementById('app'))

// const bol = ref(false)

// effect(() => {
//   const vnode = {
//     type: 'div',
//     props: bol.value
//       ? {
//           onclick: () => {
//             console.log('click parent')
//           },
//         }
//       : {},
//     children: [
//       {
//         type: 'p',
//         props: {
//           onclick: () => {
//             console.log(1)
//             bol.value = true
//           },
//         },
//         children: 'text',
//       },
//     ],
//   }
//   renderer.render(vnode, document.querySelector('#app'))
// })

const oldVNode = {
  type: 'div',
  children: [
    { type: 'p', children: '1', key: 1 },
    { type: 'p', children: '2', key: 2 },
    { type: 'p', children: '4', key: 3 },
  ],
}
const newVNode = {
  type: 'div',
  children: [
    { type: 'p', children: '4', key: 3 },
    { type: 'p', children: '5', key: 1 },
    { type: 'p', children: '6', key: 2 },
  ],
}

renderer.render(oldVNode, document.getElementById('app'))
setTimeout(() => {
  renderer.render(newVNode, document.getElementById('app'))
}, 1000)
