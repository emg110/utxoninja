import createSignedRequest from './utils/createSignedRequest'
import { CONFIG } from './defaults'

export default async ({ xprivKey, config = CONFIG, settings = {} }) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    path: '/setReceivePolicy',
    body: settings
  })
  return result
}
