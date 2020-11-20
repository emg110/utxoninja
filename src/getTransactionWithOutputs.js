const createSignedRequest = require('./utils/createSignedRequest')
const bsv = require('bsv')
const rpuzzle = require('rpuzzle')

module.exports = async ({
  xprivKey,
  config,
  outputs,
  rPuzzleInputSigningWIF,
  feePerKb = 500
}) => {
  const hdKey = bsv.HDPrivateKey.fromString(xprivKey)
  const tx = new bsv.Transaction()

  outputs.forEach(out => {
    tx.to(bsv.Script.fromString(out.script), out.satoshis)
  })

  const requiredOutputs = outputs.map(o => ({
    satoshis: o.satoshis,
    scriptLength: o.script.length / 2
  }))

  const {
    selectedInputs,
    changeOutputs,
    reference
  } = await createSignedRequest({
    xprivKey,
    config,
    path: '/createOutgoingTransaction',
    body: {
      requiredOutputs,
      feePerKb,
      rPuzzleNeeded: typeof rPuzzleInputSigningWIF !== 'undefined'
    }
  })

  // Add the change outputs
  changeOutputs.forEach(output => {
    tx.to(bsv.Script.fromString(output.script), output.amount)
  })

  // Add inputs
  for (let i = 0; i < selectedInputs.length; i++) {
    const input = selectedInputs[i]
    tx.from({
      txid: input.txid,
      outputIndex: input.vout,
      scriptPubKey: input.lockingScript,
      satoshis: input.amount
    })
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
      const puz = rpuzzle(rpuzzle.KValue.fromHex(kHex))
      puz.setPrivateKey(signingKey)
      puz.sign(tx)
    } else {
      throw new Error(
      `The server is specifying ${input.type}, which is an unknown input unlocking script type to be used`
      )
    }
  }

  // Return serialized hex and reference
  return {
    hex: tx.serialize(),
    reference
  }
}
