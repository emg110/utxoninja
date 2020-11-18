import createSignedRequest from './utils/createSignedRequest'
import bsv from 'bsv'
import boomerang from '@cwi/boomerang'

export default async ({
  xprivKey,
  config,
  outputs,
  inputSigningWIF,
  feePerKb = 500,
  broadcast = true
}) => {
  const tx = new bsv.Transaction()

  outputs.forEach(out => {
    tx.to(bsv.Script.fromString(out.script), out.satoshis)
  })

  const totalNeeded = outputs.reduce((a, e) => a + e.satoshis, 0)

  const unspentOutputs = await createSignedRequest({
    xprivKey,
    config,
    path: '/getTransactionOutputs',
    body: {
      spendable: true
    }
  })

  // The approximate size of one input
  const inputSize = 32 + 4 + 107 + 4 // txid, vout, unlockingScript, sequence
  const otherTransactionFields = 4 + 1 + 1 + 4 // version, number of inputs, number of outputs, lock time
  const totalOutputSize = outputs.reduce((a, e) => a + e.script.length / 2, 0)
  const totalOutputAmount = outputs.reduce((a, e) => a + e.satoshis, 0)

  let i = 0
  while (
    1000 * (
      (tx.inputs.length * inputSize) +
      otherTransactionFields +
      totalOutputSize
    ) / totalOutputAmount < feePerKb
  ) {
    tx.from(unspentOutputs[i])
    i++
  }

  // get change
  const changeOutputs = await createSignedRequest({
    xprivKey,
    config,
    path: '/getChangeOutputs',
    body: {
      spendable: true
    }
  })

  // sign

  // broadcast

  // process outgoing
}
