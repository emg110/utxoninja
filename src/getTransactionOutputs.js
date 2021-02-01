const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = ({
  xprivKey,
  config = CONFIG,
  spendable,
  type,
  limit = 25,
  offset = 0
} = {}) => {
  return createSignedRequest({
    xprivKey,
    config,
    feature: 'getTransactionOutputs',
    body: { limit, offset, spendable, type }
  })
}
