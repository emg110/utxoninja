const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = ({
  xprivKey,
  config = CONFIG,
  involving,
  limit = 25,
  offset = 0,
  orderBy = 'newest-first',
  labels
} = {}) => {
  return createSignedRequest({
    xprivKey,
    config,
    feature: 'getTransactions',
    body: { limit, offset, involving, orderBy, labels }
  })
}
