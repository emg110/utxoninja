import createSignedRequest from './utils/createSignedRequest'
import { CONFIG } from './defaults'

export default async ({ xprivKey, config = CONFIG, paymail }) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    path: '/changePaymail',
    body: { paymail }
  })
  return result
}
