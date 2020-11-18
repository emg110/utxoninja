import createSignedRequest from './utils/createSignedRequest'
import { CONFIG } from './defaults'

export default async ({ xprivKey, config = CONFIG }) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    path: '/getCurrentPaymails',
    body: {}
  })
  return result.aliases[0]
}
