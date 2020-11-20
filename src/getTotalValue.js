const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = ({ xprivKey, config = CONFIG } = {}) => {
  return createSignedRequest({
    xprivKey,
    config,
    path: '/getTotalOfUnspentOutputs',
    body: {}
  })
}
