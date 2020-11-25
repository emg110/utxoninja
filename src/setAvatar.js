const createSignedRequest = require('./utils/createSignedRequest')
const getPaymail = require('./getPaymail')
const { CONFIG } = require('./defaults')

module.exports = async ({ xprivKey, config = CONFIG, name, photoURL } = {}) => {
  const paymail = await getPaymail({ xprivKey, config })
  return createSignedRequest({
    xprivKey,
    config,
    feature: 'setNameAndPhotoURL',
    body: { name, photoURL, paymail }
  })
}
