const { ValidationError } = require('@cwi/errors')
const fetchMock = require('fetch-mock')

let getDojoConfig

const VALID_URL = 'https://foo.com'
const VALID_CONFIG = {
  bsvalias: '1.0',
  capabilities: {
    dojo: {
      version: '0.1.0',
      dojoURL: 'https://foo.com'
    }
  }
}
const VALID_URL_2 = 'https://bar.com'
const VALID_CONFIG_2 = {
  bsvalias: '1.0',
  capabilities: {
    dojo: {
      version: '0.1.0',
      dojoURL: 'https://bar.com'
    }
  }
}
const INVALID_CONFIG = {
  foo: 'bar'
}

describe('getDojoConfig', () => {
  beforeEach(() => {
    getDojoConfig = require('../getDojoConfig')
  })
  afterEach(() => {
    jest.clearAllMocks()
    fetchMock.restore()
    jest.resetModules()
  })
  it('Throws a TypeError if dojoURL is not a string', async () => {
    await expect(
      getDojoConfig({ ob: 'ject' })
    ).rejects.toThrow(new TypeError(
      'The Dojo URL must be a string, but object was given!'
    ))
  })
  it('Throws a ValidationError if dojoURL is not a valid URL', async () => {
    await expect(
      getDojoConfig('A potato flew around my room')
    ).rejects.toThrow(new TypeError(
      'The provided Dojo URL (A potato flew around my room) is not a valid URL!'
    ))
  })
  it('Requests the data by default from the provided URL', async () => {
    fetchMock.getOnce(
      `${VALID_URL}/.well-known/bsvalias`,
      {
        body: VALID_CONFIG
      }
    )
    await getDojoConfig(VALID_URL)
    expect(fetchMock.calls()[0][0]).toEqual(
      `${VALID_URL}/.well-known/bsvalias`
    )
  })
  it('Caches successive requests to the same URL', async () => {
    fetchMock.getOnce(
      `${VALID_URL_2}/.well-known/bsvalias`,
      {
        body: VALID_CONFIG_2
      }
    )
    const cfg1 = await getDojoConfig(VALID_URL_2)
    const cfg2 = await getDojoConfig(VALID_URL_2)
    expect(fetchMock.calls()[0][0]).toEqual(
      `${VALID_URL_2}/.well-known/bsvalias`
    )
    expect(fetchMock.calls().length).toEqual(1)
    expect(cfg1).toEqual(cfg2)
    expect(cfg1).toEqual(VALID_CONFIG_2)
  })
  it('Throws a ValidationError if the Dojo cannot be contacted', async () => {
    fetchMock.getOnce(`${VALID_URL}/.well-known/bsvalias`, {
      body: {}
    })
    await expect(getDojoConfig(
      VALID_URL
    )).rejects.toThrow(new ValidationError(
      `The server at ${VALID_URL} does not appear to be a Dojo!`
    ))
  })
  it('Returns the data from the requested URL', async () => {
    fetchMock.getOnce(
      `${VALID_URL}/.well-known/bsvalias`,
      {
        body: VALID_CONFIG
      }
    )
    const actualValue = await getDojoConfig(VALID_URL)
    expect(actualValue).toEqual(VALID_CONFIG)
  })
  it('Throws a ValidationError if the URL is not for a Dojo', async () => {
    fetchMock.getOnce(
      `${VALID_URL}/.well-known/bsvalias`,
      {
        body: INVALID_CONFIG
      }
    )
    await expect(getDojoConfig(VALID_URL)).rejects.toThrow(new ValidationError(
      `The server at ${VALID_URL} does not appear to be a Dojo!`
    ))
  })
  it('Throws a ValidationError if the dojoURL in the config object does not match the one requested', async () => {
    fetchMock.getOnce(
      `${VALID_URL}/.well-known/bsvalias`,
      {
        body: VALID_CONFIG_2
      }
    )
    await expect(getDojoConfig(VALID_URL)).rejects.toThrow(new ValidationError(
      `The server at ${VALID_URL} is not configured properly! Its dojoURL from the well-known endpoint (${VALID_URL_2}) does not match ${VALID_URL}`
    ))
  })
  it('Re-requests the config object if the dojoURL from settings changes', async () => {
    fetchMock.getOnce(
      `${VALID_URL}/.well-known/bsvalias`,
      {
        body: VALID_CONFIG
      }
    )
    await getDojoConfig(VALID_URL)
    fetchMock.getOnce(
      `${VALID_URL_2}/.well-known/bsvalias`,
      {
        body: VALID_CONFIG_2
      }
    )
    await getDojoConfig(VALID_URL)
  })
})
