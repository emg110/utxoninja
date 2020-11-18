import createSignedRequest from './utils/createSignedRequest'
import { CONFIG } from './defaults'

export default async ({
  xprivKey,
  config = CONFIG,
  submittedTransaction,
  note,
  recipient
}) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    path: '/processOutgoingTransaction',
    body: { hex: submittedTransaction, note, recipient }
  })
  return result
}
