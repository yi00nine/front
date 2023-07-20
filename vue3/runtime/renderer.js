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
  function mountElement(vnode, container) {
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
    insert(el, container)
  }
  function patchElement(n1, n2) {
    //todo
    const el = n1.el 
    el.addEventListener('click', n2.props.onclick)
  }
  /**
   * @param n1 - 旧的元素
   * @param n2 - 新的元素
   * @param container - 挂载的具体位置
   */
  function patch(n1, n2, container) {
    if (n1 && n1.type !== n2.type) {
      unmount(n1)
      n1 = null
    }
    const { type } = n2
    if (typeof type === 'string') {
      if (!n1) {
        mountElement(n2, container)
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
  return { render }
}
const renderer = createRenderer({
  createElement(type) {
    return document.createElement(type)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, container) {
    container.appendChild(el)
  },
  patchProps(key, el, preVal, nextVal) {
    if (/^on/.test(key)) {
      let invokers ={} //缓存绑定的事件
      el._vei = invokers
      let invoker = invokers[key]
      const name = key.slice(2).toLowerCase()
      if (nextVal) {
        if (!invoker) {
          invoker = el._vei[key] = (e) => {
            invoker.value(e)
          }
          invoker.value = nextVal
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

const bol = ref(false)

effect(() => {
  const vnode = {
    type: 'div',
    props: bol.value
      ? {
          onclick: () => {
            console.log('click parent')
          },
        }
      : {},
    children: [
      {
        type: 'p',
        props: {
          onclick: () => {
            console.log(1)
            bol.value = true
          },
        },
        children:'text'
      },
    ],
  }
renderer.render(vnode, document.querySelector('#app'))
})
