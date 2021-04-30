const boomerang = require('boomerang-http')
const bsv = require('bsv')
const getDojoConfig = require('./getDojoConfig')

module.exports = async ({ xprivKey, config, feature, body }) => {
  const serverConfig = await getDojoConfig(config.dojoURL)
  const hdPriv = bsv.HDPrivateKey.fromString(xprivKey)
  const privKey = hdPriv.privateKey
  const xpub = hdPriv.hdPublicKey.toString()
  const dt = parseInt(Date.now() / 1000)
  if (typeof serverConfig.capabilities.dojo[feature] !== 'string') {
    throw new Error(
      `The ${feature} feature is not configured on this Dojo!`
    )
  }
  const messageToSign = JSON.stringify({
    body,
    dt,
    url: serverConfig.capabilities.dojo[feature],
    xpub
  })
  const signature = bsv.crypto.ECDSA.sign(
    bsv.crypto.Hash.sha256(Buffer.from(messageToSign)),
    privKey
  ).toString()
  const result = await boomerang(
    'POST',
    serverConfig.capabilities.dojo[feature],
    {
      ...body,
      auth: { dt, xpub, signature }
    }
  )
  if (typeof result === 'object' && result.status === 'error') {
    const e = new Error(
      `${result.code}: ${result.description}`
    )
    Object
      .keys(result)
      .filter(x => x !== 'status' && x !== 'description')
      .forEach(x => { e[x] = result[x] })
    throw e
  }
  return result
}
