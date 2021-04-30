const { CONFIG } = require('./defaults')
const getDojoConfig = require('./utils/getDojoConfig')
const getPaymail = require('./getPaymail')
const boomerang = require('boomerang-http')

module.exports = async ({ xprivKey, config = CONFIG } = {}) => {
  const serverConfig = await getDojoConfig(config.dojoURL)
  const paymail = await getPaymail({ xprivKey, config })
  const [alias, domain] = paymail.split('@')
  const result = await boomerang(
    'GET',
    serverConfig.capabilities.f12f968c92d6
      .replace('{alias}', alias)
      .replace('{domain.tld}', domain)
  )
  if (typeof result === 'object' && result.status === 'error') {
    throw new Error(
      `${result.code}: ${result.description}`
    )
  }
  return result
}
