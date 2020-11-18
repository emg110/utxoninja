const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = async ({ xprivKey, config = CONFIG, paymail }) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    path: '/changePaymail',
    body: { paymail }
  })
  return result
}
