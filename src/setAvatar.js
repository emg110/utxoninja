import createSignedRequest from './utils/createSignedRequest'
import getPaymail from './getPaymail'

export default async ({ xprivKey, config, name, photoURL }) => {
  const paymail = await getPaymail({ xprivKey, config })
  return createSignedRequest({
    xprivKey,
    config,
    path: '/setNameAndPhotoURL',
    body: { name, photoURL, paymail }
  })
}
