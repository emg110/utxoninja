const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = async ({
  xprivKey,
  config = CONFIG,
  submittedTransaction,
  note,
  recipient,
  reference
} = {}) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    feature: 'processOutgoingTransaction',
    body: { hex: submittedTransaction, reference, note, recipient }
  })
  return result
}
