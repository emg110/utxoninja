const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = async ({
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
