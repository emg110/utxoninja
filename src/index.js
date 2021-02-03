module.exports = {
  getPaymail: require('./getPaymail'),
  setPaymail: require('./setPaymail'),
  getSettings: require('./getSettings'),
  setSettings: require('./setSettings'),
  getAvatar: require('./getAvatar'),
  setAvatar: require('./setAvatar'),
  getTransactions: require('./getTransactions'),
  getTotalValue: require('./getTotalValue'),
  getTransactionWithOutputs: require('./getTransactionWithOutputs'),
  createOutgoingTransaction: require('./createOutgoingTransaction'),
  processOutgoingTransaction: require('./processOutgoingTransaction'),
  markMissingTxInputsAsSpent: require('./markMissingTxInputsAsSpent'),
  getTransactionOutputs: require('./getTransactionOutputs'),
  updateTransactionStatus: require('./updateTransactionStatus'),
  updateOutpointStatus: require('./updateOutpointStatus')
}
