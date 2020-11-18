const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = async ({ xprivKey, config = CONFIG, settings = {} }) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    path: '/setReceivePolicy',
    body: settings
  })
  return result
}
