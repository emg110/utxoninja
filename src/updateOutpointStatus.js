const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = ({
  xprivKey,
  config = CONFIG,
  txid,
  vout,
  spendable
} = {}) => {
  return createSignedRequest({
    xprivKey,
    config,
    feature: 'updateOutpointStatus',
    body: { txid, vout, spendable }
  })
}
