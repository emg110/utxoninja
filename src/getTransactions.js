const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = ({
  xprivKey,
  config = CONFIG,
  involving,
  label,
  limit = 25,
  offset = 0,
  orderBy = 'newest-first'
} = {}) => {
  return createSignedRequest({
    xprivKey,
    config,
    feature: 'getTransactions',
    body: { limit, offset, involving, orderBy, label }
  })
}
