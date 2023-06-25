class testPlugin {
  constructor(doneCallback, failCallback) {
    this.doneCallback = doneCallback
    this.failCallback = failCallback
  }
  apply(compiler) {
    compiler.hooks.done.tap('testPlugin', (stats) => {
      const { startTime, endTime } = stats
      const buildTime = (endTime - startTime) / 1000
      const { errors, warnings } = stats.toJson()
      console.log(`Build time: ${buildTime}s`)
      console.log(`Build result: ${errors.length > 0 ? 'failed' : 'success'}`)
    })
  }
}

module.exports = testPlugin
