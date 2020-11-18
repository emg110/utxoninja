import createSignedRequest from './utils/createSignedRequest'
import getPaymail from './getPaymail'
import { CONFIG } from './defaults'

export default async ({ xprivKey, config = CONFIG, name, photoURL }) => {
  const paymail = await getPaymail({ xprivKey, config })
  return createSignedRequest({
    xprivKey,
    config,
    path: '/setNameAndPhotoURL',
    body: { name, photoURL, paymail }
  })
}
