const createSignedRequest = require('./utils/createSignedRequest')
const { CONFIG } = require('./defaults')

module.exports = ({
  xprivKey,
  config = CONFIG,
  involving,
  label,
  direction,
  startTime,
  endTime
} = {}) => {
  return createSignedRequest({
    xprivKey,
    config,
    feature: 'getTotalOfAmounts',
    body: { involving, label, direction, startTime, endTime }
  })
}
