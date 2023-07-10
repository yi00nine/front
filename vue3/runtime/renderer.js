import { ref } from '../reactivity/ref.js'
import { effect } from '../reactivity/effect.js'

const vnode = {
  type: 'div',
  props: {
    id: 'foo',
  },
  children: [
    {
      type: 'p',
      children: 'hello',
    },
  ],
}

function createRenderer(options) {
  const { createElement, setElementText, insert } = options
  function render(vnode, container) {
    if (vnode) {
      //patch
      patch(container._vnode, vnode, container)
    } else {
      if (container._vnode) {
        //delete
        container.innerHTML = ''
      }
    }
    container._vnode = vnode
  }
  function mountElement(vnode, container) {
    const el = createElement(vnode.type)
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        patch(null, child, el)
      })
    }
    if (vnode.props) {
      for (const key in vnode.props) {
        el.setAttribute(key, vnode.props[key])
      }
    }
    insert(el, container)
  }
  /**
   * @param n1 - 旧的元素
   * @param n2 - 新的元素
   * @param container - 挂载的具体位置
   */
  function patch(n1, n2, container) {
    if (!n1) {
      mountElement(n2, container)
    } else {
      //todo
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
})

renderer.render(vnode, document.getElementById('app'))
