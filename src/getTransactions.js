import createSignedRequest from './utils/createSignedRequest'
import { CONFIG } from './defaults'

export default ({
  xprivKey,
  config = CONFIG,
  involving,
  limit = 25,
  offset = 0,
  orderBy = 'newest-first'
}) => {
  return createSignedRequest({
    xprivKey,
    config,
    path: '/getTransactions',
    body: { limit, offset, involving, orderBy }
  })
}
