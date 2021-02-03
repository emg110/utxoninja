const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = ({
  xprivKey,
  config = CONFIG,
  reference,
  status
} = {}) => {
  return createSignedRequest({
    xprivKey,
    config,
    feature: 'updateTransactionStatus',
    body: { status, reference }
  })
}
