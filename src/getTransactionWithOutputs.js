const createSignedRequest = require('./utils/createSignedRequest')
const bsv = require('bsv')
const rpuzzle = require('rpuzzle')
const { CONFIG } = require('./defaults')

module.exports = async ({
  xprivKey,
  config = CONFIG,
  outputs,
  rPuzzleInputSigningWIF,
  feePerKb = 500,
  labels
} = {}) => {
  const hdKey = bsv.HDPrivateKey.fromString(xprivKey)
  const tx = new bsv.Transaction()

  outputs.forEach(out => {
    tx.addOutput(new bsv.Transaction.Output({
      script: new bsv.Script(out.script),
      satoshis: out.satoshis
    }))
  })

  const requiredOutputs = outputs.map(o => ({
    amount: o.satoshis,
    scriptLength: o.script.length / 2
  }))

  const createResult = await createSignedRequest({
    xprivKey,
    config,
    feature: 'createOutgoingTransaction',
    body: {
      requiredOutputs,
      feePerKb,
      rPuzzleNeeded: typeof rPuzzleInputSigningWIF !== 'undefined',
      labels
    }
  })

  if (createResult.status !== 'success') {
    return createResult
  }

  const {
    selectedInputs,
    changeOutputs,
    reference
  } = createResult

  // Add the change outputs
  changeOutputs.forEach(output => {
    tx.addOutput(new bsv.Transaction.Output({
      script: bsv.Script.fromString(output.script),
      satoshis: output.satoshis
    }))
  })

  // Add inputs
  for (let i = 0; i < selectedInputs.length; i++) {
    const input = selectedInputs[i]
    tx.from(bsv.Transaction.UnspentOutput({
      txid: input.txid,
      outputIndex: input.vout,
      scriptPubKey: input.lockingScript,
      satoshis: input.amount
    }))
  }

  //  Sign inputs based on the input type
  for (let i = 0; i < selectedInputs.length; i++) {
    const input = selectedInputs[i]
    const childKey = hdKey.deriveChild(input.derivationPath).privateKey
    if (input.type === 'P2PKH') {
      tx.sign(childKey)
    } else if (input.type === 'P2RPH') {
      const kHex = childKey.toBuffer().toString('hex')
      const signingKey = typeof rPuzzleInputSigningWIF === 'undefined'
        ? bsv.PrivateKey.fromRandom()
        : bsv.PrivateKey.fromWIF(rPuzzleInputSigningWIF)
      const puz = rpuzzle(rpuzzle.KValue.fromHex(kHex), signingKey)
      puz.sign(tx)
    } else {
      throw new Error(
        `The server is specifying ${input.type}, which is an unknown input unlocking script type to be used`
      )
    }
  }

  // Return serialized hex and reference
  return {
    hex: tx.uncheckedSerialize(),
    reference
  }
}
