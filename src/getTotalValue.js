import createSignedRequest from './utils/createSignedRequest'
import { CONFIG } from './defaults'

export default ({ xprivKey, config = CONFIG }) => {
  return createSignedRequest({
    xprivKey,
    config,
    path: '/getTotalOfUnspentOutputs',
    body: {}
  })
}
