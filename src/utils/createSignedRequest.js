const boomerang = require('@cwi/boomerang')
const bsv = require('bsv')

module.exports = async ({ xprivKey, config, path, body }) => {
  const hdPriv = bsv.HDPrivateKey.fromString(xprivKey)
  const privKey = hdPriv.privateKey
  const xpub = hdPriv.hdPublicKey.toString()
  const dt = parseInt(Date.now() / 1000)
  const messageToSign = JSON.stringify({
    body,
    dt,
    url: `${config.dojoURL}${path}`,
    xpub
  })
  console.log(messageToSign)
  const signature = bsv.crypto.ECDSA.sign(
    bsv.crypto.Hash.sha256(Buffer.from(messageToSign)),
    privKey
  ).toString()
  return boomerang(
    'POST',
    `${config.dojoURL}${path}`,
    {
      ...body,
      auth: { dt, xpub, signature }
    }
  )
}
