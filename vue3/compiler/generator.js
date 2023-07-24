module.exports = function generate(node) {
  const context = {
    code: '',
    push(code) {
      context.code += code
    },
    currentIndent: 0,
    newLine() {
      context.code += '\n' + '  '.repeat(context.currentIndent)
    },
    indent() {
      // 缩进
      context.currentIndent++
      context.newLine()
    },
    deIndent() {
      // 取消缩进
      context.currentIndent--
      context.newLine()
    },
  }
  genNode(node, context)
  return context.code
}

function genNode(node, context) {
  console.log(1,node)
  switch (node.type) {
    case 'FunctionDecl':
      genFunctionDecl(node, context)
      break
    case 'ReturnStatement':
      genReturnStatement(node, context)
      break
    case 'CallExpression':
      genCallExpression(node, context)
      break
    case 'ArrayExpression':
      genArrayExpression(node, context)
      break
    case 'StringLiteral':
      genStringLiteral(node, context)
      break
  }
}

function genFunctionDecl(node, context) {
  const { push, indent, deIndent } = context
  push(`function ${node.id.name} (`)
  genNodeList(node.params, context)
  push(`) {`)
  indent() // 缩进
  node.body.forEach((n) => genNode(n, context)) // body是一个数组，每个值都是一条语句
  deIndent() // 取消缩进
  push('}')
}

function genNodeList(nodes, context) {
  const { push } = context
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    genNode(node, context)
    if (i < nodes.length - 1) {
      push(', ')
    }
  }
}

function genArrayExpression(node, context) {
  const { push } = context
  push('[')
  genNodeList(node.elements, context)
  push(']')
}

function genReturnStatement(node, context) {
  const { push } = context
  push('return ')
  genNode(node.return, context)
}

function genStringLiteral(node, context) {
  const { push } = context
  push(`'${node.value}'`)
}

function genCallExpression(node, context) {
  const { push } = context
  const { callee, arguments: args } = node // 取得引用函数的名称callee和参数
  push(`${callee.name}(`)
  genNodeList(args, context) // 生成参数列表
  push(')')
}
