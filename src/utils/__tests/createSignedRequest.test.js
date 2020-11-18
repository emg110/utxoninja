const createSignedRequest = require('../createSignedRequest')
const boomerang = require('@cwi/boomerang')
const bsv = require('bsv')

jest.mock('@cwi/boomerang')

describe('createSignedRequest', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('Calls boomerang with proper data', async () => {
    await createSignedRequest({
      xprivKey: 'xprv9s21ZrQH143K2zGP3VU54dJPkLEZCtnbk7F7aPDdnCAgsLT7PtZJZKxZ5joWFoTVeL65Uge48CinBnw7da17xLGFUxWKkTYWtyG42ceXaQH',
      config: {
        dojoURL: 'http://localhost:3998/api'
      },
      body: {
        foo: 'bar'
      },
      url: '/getFoo'
    })
    expect(boomerang).toHaveBeenCalledWith(
      'POST',
      'http://localhost:3998/api/getFoo',
      {
        auth: {
          xpub: 'xpub661MyMwAqRbcFULr9X15RmF8JN53cMWT7LAiNmdFLXhfk8nFwRsZ78H2w4CL9qqwDF1R39ZGU1F4DbV9S2tqaMDzWM3CoeQs4NGYrbp79ej',
          dt: expect.any(Number),
          signature: expect.any(String)
        },
        foo: 'bar'
      }
    )
    const message = Buffer.from(JSON.stringify({
      dt: boomerang.mock.calls[0][2].auth.dt,
      body: { foo: 'bar' },
      url: 'http://localhost:3998/api/getFoo',
      xpub: 'xpub661MyMwAqRbcFULr9X15RmF8JN53cMWT7LAiNmdFLXhfk8nFwRsZ78H2w4CL9qqwDF1R39ZGU1F4DbV9S2tqaMDzWM3CoeQs4NGYrbp79ej'
    }))
    const priv = bsv.HDPrivateKey.fromString('xprv9s21ZrQH143K2zGP3VU54dJPkLEZCtnbk7F7aPDdnCAgsLT7PtZJZKxZ5joWFoTVeL65Uge48CinBnw7da17xLGFUxWKkTYWtyG42ceXaQH').privateKey
    const expectedSignature = bsv.crypto.ECDSA.sign(
      bsv.crypto.Hash.sha256(message),
      priv
    ).toString()
    expect(boomerang.mock.calls[0][2].auth.signature).toEqual(expectedSignature)
  })
})
