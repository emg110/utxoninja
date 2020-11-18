import createSignedRequest from './utils/createSignedRequest'

export default async ({ xprivKey, config, settings = {} }) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    path: '/setReceivePolicy',
    body: settings
  })
  return result
}
