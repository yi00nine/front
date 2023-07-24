const parser = require('./parser.js')
const generate = require('./generator.js')
function dump(node, indent = 0) {
  const type = node.type
  const desc =
    node.type === 'root'
      ? ''
      : node.type === 'Element'
      ? node.tag
      : node.content
  console.log(`${'-'.repeat(indent)}${type}:${desc}`)
  if (node.children) {
    node.children.forEach((el) => dump(el, indent + 2))
  }
}

function traverseNode(ast, context) {
  context.currentNode = ast
  const exitFns = []
  const transforms = context.nodeTransform
  for (let i = 0; i < transforms.length; i++) {
    const onExit = transforms[i](context.currentNode, context)
    if (onExit) {
      exitFns.push(onExit)
    }
    if (context.currentNode === null) return
  }
  const children = context.currentNode.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      context.parent = context.currentNode
      context.childIndex = i
      traverseNode(children[i], context)
    }
  }
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

function transform(ast) {
  const context = {
    currentNode: null,
    childIndex: 0,
    parent: null,
    replaceNode(node) {
      context.parent.children[context.childIndex] = node
      context.currentNode = node
    },
    removeNode() {
      if (context.parent) {
        context.parent.children.splice(context.childIndex, 1)
        context.currentNode = null
      }
    },
    nodeTransform: [transformElement, transformText, transformRoot],
  }
  traverseNode(ast, context)
  // console.log(dump(ast))
}

function transformElement(node, context) {
  return () => {
    if (node.type !== 'Element') return
    const callExp = createCallExpression('h', [createStringLiteral(node.tag)])
    node.children.length === 1
      ? callExp.arguments.push(createStringLiteral(node.children[0].jsNode))
      : callExp.arguments.push(
          createArrayExpression(node.children.map((el) => el.jsNode))
        )
    node.jsNode = callExp
  }
}

function transformText(node, context) {
  if (node.type !== 'Text') return
  node.jsNode = createStringLiteral(node.content)
}

function transformRoot(node) {
  return () => {
    if (node.type !== 'root') return
    const vnodeJsAST = node.children[0].jsNode
    node.jsNode = {
      type: 'FunctionDecl',
      id: { type: 'Identifier', name: 'render' },
      params: [],
      body: [
        {
          type: 'ReturnStatement',
          return: vnodeJsAST,
        },
      ],
    }
  }
}



function createStringLiteral(value) {
  return {
    type: 'StringLiteral',
    value,
  }
}
function createIdentifier(name) {
  return {
    type: 'Identifier',
    name,
  }
}
function createArrayExpression(elements) {
  return {
    type: 'ArrayExpression',
    elements,
  }
}

function createCallExpression(callee, arguments) {
  return {
    type: 'CallExpression',
    callee: createIdentifier(callee),
    arguments,
  }
}


function compiler(template){
  const ast = parser('<div><p>hello</p><p>world</p></div>')
  transform(ast)
  const code = generate(ast.jsNode)
  console.log(code)
  return code
}

compiler()