const bsv = require('bsv')
const createSignedRequest = require('./utils/createSignedRequest')
const boomerang = require('boomerang-http')

module.exports = async ({ xprivKey, config, hex, reference }) => {
  const tx = new bsv.Transaction(hex)
  // Build a batch of outpoints for Matterpool
  const outpointBatch = tx.inputs
    .map(i => ({
      txid: Buffer.from(i.prevTxId).toString('hex'),
      vout: i.outputIndex
    }))
    .reduce((acc, { txid, vout }) => `${acc}${txid}_o${vout},`, '')
    .slice(0, -1)

  // Check spent status of tansaction inputs
  const spendStatus = await boomerang(
    'GET',
    `https://txdb.mattercloud.io/api/v1/spends/${outpointBatch}`
  )
  const spentOutpoints = Object.entries(spendStatus.result)
    .filter(([_, stat]) => stat !== null)
  await Promise.all(
    spentOutpoints.map(([outpoint, spendingTxInfo]) => {
      return createSignedRequest({
        xprivKey,
        config,
        feature: 'updateOutpointStatus',
        body: {
          txid: outpoint.split('_o')[0],
          vout: outpoint.split('_o')[1],
          spendable: false
          // Dojo doesn't currently need this, but it may be useful for future
          // spendingTXID: spendingTxInfo.spend_txid,
          // spendingIndex: spendingTxInfo.spend_index
        }
      })
    })
  )

  // If a reference was given, cancel the transaction for that reference
  if (typeof reference === 'string') {
    await createSignedRequest({
      xprivKey,
      config,
      feature: 'updateTransactionStatus',
      body: {
        reference,
        status: 'abortedInputsWereMissing'
      }
    })
  }

  // POSSIBLE TODO: Create a new transaction that will work?
}
