import createSignedRequest from './utils/createSignedRequest'

export default ({ xprivKey, config }) => {
  return createSignedRequest({
    xprivKey,
    config,
    path: '/getTotalOfUnspentOutputs',
    body: {}
  })
}
