import createSignedRequest from './utils/createSignedRequest'

export default async ({ xprivKey, config }) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    path: '/getCurrentPaymails',
    body: {}
  })
  return result.aliases[0]
}
