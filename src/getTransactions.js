import createSignedRequest from './utils/createSignedRequest'

export default ({
  xprivKey, config, involving, limit = 25, offset = 0, orderBy = 'newest-first'
}) => {
  return createSignedRequest({
    xprivKey,
    config,
    path: '/getTransactions',
    body: { limit, offset, involving, orderBy }
  })
}
