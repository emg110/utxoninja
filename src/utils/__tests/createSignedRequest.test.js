const createSignedRequest = require('../createSignedRequest')
const boomerang = require('@cwi/boomerang')
const bsv = require('bsv')
const getDojoConfig = require('../getDojoConfig')
const { ValidationError } = require('@cwi/errors')

jest.mock('@cwi/boomerang')
jest.mock('../getDojoConfig')

describe('createSignedRequest', () => {
  beforeEach(() => {
    getDojoConfig.mockReturnValue({
      bsvalias: '1.0',
      capabilities: {
        dojo: {
          version: '0.1.0',
          dojoURL: 'https://foo.com',
          featureOne: 'https://foo.com/featureOne',
          featureTwo: 'https://foo.com/featureTwo'
        }
      }
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('Calls boomerang with proper data', async () => {
    await createSignedRequest({
      xprivKey: 'xprv9s21ZrQH143K2zGP3VU54dJPkLEZCtnbk7F7aPDdnCAgsLT7PtZJZKxZ5joWFoTVeL65Uge48CinBnw7da17xLGFUxWKkTYWtyG42ceXaQH',
      config: {
        dojoURL: 'https://foo.com'
      },
      body: {
        foo: 'bar'
      },
      feature: 'featureOne'
    })
    expect(boomerang).toHaveBeenCalledWith(
      'POST',
      'https://foo.com/featureOne',
      {
        auth: {
          xpub: 'xpub661MyMwAqRbcFULr9X15RmF8JN53cMWT7LAiNmdFLXhfk8nFwRsZ78H2w4CL9qqwDF1R39ZGU1F4DbV9S2tqaMDzWM3CoeQs4NGYrbp79ej',
          dt: expect.any(Number),
          signature: expect.any(String)
        },
        foo: 'bar'
      }
    )
    const message = JSON.stringify({
      body: { foo: 'bar' },
      dt: boomerang.mock.calls[0][2].auth.dt,
      url: 'https://foo.com/featureOne',
      xpub: 'xpub661MyMwAqRbcFULr9X15RmF8JN53cMWT7LAiNmdFLXhfk8nFwRsZ78H2w4CL9qqwDF1R39ZGU1F4DbV9S2tqaMDzWM3CoeQs4NGYrbp79ej'
    })
    const priv = bsv.HDPrivateKey.fromString('xprv9s21ZrQH143K2zGP3VU54dJPkLEZCtnbk7F7aPDdnCAgsLT7PtZJZKxZ5joWFoTVeL65Uge48CinBnw7da17xLGFUxWKkTYWtyG42ceXaQH').privateKey
    const expectedSignature = bsv.crypto.ECDSA.sign(
      bsv.crypto.Hash.sha256(Buffer.from(message)),
      priv
    ).toString()
    expect(boomerang.mock.calls[0][2].auth.signature).toEqual(expectedSignature)
  })
  it('Calls getDojoConfig with the proper URL', async () => {
    await createSignedRequest({
      xprivKey: 'xprv9s21ZrQH143K2zGP3VU54dJPkLEZCtnbk7F7aPDdnCAgsLT7PtZJZKxZ5joWFoTVeL65Uge48CinBnw7da17xLGFUxWKkTYWtyG42ceXaQH',
      config: {
        dojoURL: 'https://bar.com'
      },
      body: {
        foo: 'bar'
      },
      feature: 'featureOne'
    })
    expect(getDojoConfig).toHaveBeenCalledWith('https://bar.com')
  })
  it('Throws an error if the feature is not supported by the dojo', async () => {
    await expect(createSignedRequest({
      xprivKey: 'xprv9s21ZrQH143K2zGP3VU54dJPkLEZCtnbk7F7aPDdnCAgsLT7PtZJZKxZ5joWFoTVeL65Uge48CinBnw7da17xLGFUxWKkTYWtyG42ceXaQH',
      config: {
        dojoURL: 'https://bar.com'
      },
      body: {
        foo: 'bar'
      },
      feature: 'featureThree'
    })).rejects.toThrow(new ValidationError(
      'The featureThree feature is not configured on this Dojo!'
    ))
  })
  it('Returns the valu from boomerang', async () => {
    boomerang.mockReturnValue('MOCK_RV')
    expect(await createSignedRequest({
      xprivKey: 'xprv9s21ZrQH143K2zGP3VU54dJPkLEZCtnbk7F7aPDdnCAgsLT7PtZJZKxZ5joWFoTVeL65Uge48CinBnw7da17xLGFUxWKkTYWtyG42ceXaQH',
      config: {
        dojoURL: 'https://bar.com'
      },
      body: {
        foo: 'bar'
      },
      feature: 'featureOne'
    })).toEqual('MOCK_RV')
  })
  it('Throws errors from the API', async () => {
    boomerang.mockReturnValue({
      status: 'error',
      code: 'ERR_BAD_THING',
      description: 'A bad thing happened'
    })
    expect(createSignedRequest({
      xprivKey: 'xprv9s21ZrQH143K2zGP3VU54dJPkLEZCtnbk7F7aPDdnCAgsLT7PtZJZKxZ5joWFoTVeL65Uge48CinBnw7da17xLGFUxWKkTYWtyG42ceXaQH',
      config: {
        dojoURL: 'https://bar.com'
      },
      body: {
        foo: 'bar'
      },
      feature: 'featureOne'
    })).rejects.toThrow(new Error(
      'ERR_BAD_THING: A bad thing happened'
    ))
  })
})
