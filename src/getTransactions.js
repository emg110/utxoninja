const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = ({
  xprivKey,
  config = CONFIG,
  involving,
  limit = 25,
  offset = 0,
  orderBy = 'newest-first'
}) => {
  return createSignedRequest({
    xprivKey,
    config,
    path: '/getTransactions',
    body: { limit, offset, involving, orderBy }
  })
}
