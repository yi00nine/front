const { getOptions } = require('loader-utils')
module.exports = function (source) {
  // console.log(source)
  console.log(getOptions, this.query)
  const resource = source.replace('webpack loader', this.query.params)
  return resource
}
