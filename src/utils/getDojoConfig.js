const boomerang = require('boomerang-http')
const validURL = require('./validURL')

let config = null

module.exports = async dojoURL => {
  if (
    config !== null &&
    config.capabilities.dojo.dojoURL === dojoURL
  ) {
    return config
  } else {
    if (typeof dojoURL !== 'string') {
      throw new TypeError(
        `The Dojo URL must be a string, but ${typeof dojoURL} was given!`
      )
    }
    if (!validURL(dojoURL)) {
      throw new Error(
        `The provided Dojo URL (${dojoURL}) is not a valid URL!`
      )
    }
    const newConfig = await boomerang(
      'GET',
      `${dojoURL}/.well-known/bsvalias`
    )
    if (
      newConfig.bsvalias === '1.0' &&
      typeof newConfig.capabilities === 'object' &&
      typeof newConfig.capabilities.dojo === 'object' &&
      newConfig.capabilities.dojo.version === '0.1.0'
    ) {
      if (newConfig.capabilities.dojo.dojoURL !== dojoURL) {
        throw new Error(
          `The server at ${dojoURL} is not configured properly! Its dojoURL from the well-known endpoint (${newConfig.capabilities.dojo.dojoURL}) does not match ${dojoURL}`
        )
      }
      config = newConfig
      return newConfig
    } else {
      throw new Error(
        `The server at ${dojoURL} does not appear to be a Dojo!`
      )
    }
  }
}
