const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = async ({ xprivKey, config = CONFIG } = {}) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    feature: 'getCurrentReceivePolicy',
    body: {}
  })
  return result
}
