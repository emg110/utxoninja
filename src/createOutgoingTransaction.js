const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = async ({
  xprivKey,
  config = CONFIG,
  foreignInputs,
  requiredOutputs,
  feePerKb
} = {}) => {
  const result = await createSignedRequest({
    xprivKey,
    config,
    path: '/createOutgoingTransaction',
    body: { foreignInputs, requiredOutputs, feePerKb }
  })
  return result
}
