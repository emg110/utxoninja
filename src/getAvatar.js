const { PaymailClient } = require('@moneybutton/paymail-client')
const getPaymail = require('./getPaymail')
const { CONFIG } = require('./defaults')

module.exports = async ({ xprivKey, config = CONFIG } = {} = {}) => {
  const client = new PaymailClient()
  return client.getPublicProfile(
    await getPaymail({ xprivKey, config })
  )
}
