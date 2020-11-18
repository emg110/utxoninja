import createSignedRequest from './utils/createSignedRequest'
import getPaymail from './getPaymail'
import { CONFIG } from './defaults'

module.exports = async ({ xprivKey, config = CONFIG, name, photoURL }) => {
  const paymail = await getPaymail({ xprivKey, config })
  return createSignedRequest({
    xprivKey,
    config,
    path: '/setNameAndPhotoURL',
    body: { name, photoURL, paymail }
  })
}
