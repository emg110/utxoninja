import createSignedRequest from './utils/createSignedRequest'

export default async ({ xprivKey, config, paymail }) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    path: '/changePaymail',
    body: { paymail }
  })
  return result
}
