import createSignedRequest from './utils/createSignedRequest'

export default async ({ xprivKey, config }) => {
  const [result] = await createSignedRequest({
    xprivKey,
    config,
    path: '/getCurrentReceivePolicy',
    body: {}
  })
  return result
}
