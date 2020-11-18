const { PaymailClient } = require('@moneybutton/paymail-client')
const dns = require('dns')
const fetch = require('isomorphic-fetch')
const getPaymail = require('./getPaymail')
const { CONFIG } = require('./defaults')

module.exports = async ({ xprivKey, config = CONFIG }) => {
  const client = new PaymailClient(dns, fetch)
  return client.getPublicProfile(
    await getPaymail({ xprivKey, config })
  )
}
