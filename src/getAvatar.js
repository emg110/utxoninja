import { PaymailClient } from '@moneybutton/paymail-client'
import dns from 'dns'
import fetch from 'isomorphic-fetch'
import getPaymail from './getPaymail'
import { CONFIG } from './defaults'

export default async ({ xprivKey, config = CONFIG }) => {
  const client = new PaymailClient(dns, fetch)
  return client.getPublicProfile(
    await getPaymail({ xprivKey, config })
  )
}
