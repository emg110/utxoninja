const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = async ({
  xprivKey,
  config = CONFIG,
  foreignInputs,
  requiredOutputs,
  rPuzzleNeeded,
  feePerKb,
  labels
} = {}) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    feature: 'createOutgoingTransaction',
    body: { foreignInputs, requiredOutputs, rPuzzleNeeded, feePerKb, labels }
  })
  return result
}
