# @cwi/utxoninja

Management for P2PKH and P2RPH UTXOs

## Exported Functions

Name                      | Description
--------------------------|-----------------------------
getTransactionWithOutputs | Creates and broadcasts a new transaction spending to a specific set of output scripts
getSettings               | Retrieves the settings from the Dojo server
setSettings               | Updates the settings on the Dojo server
getPaymail                | Retrieves your current Paymail from the Dojo server
setPaymail                | Sets a new Paymail on the Dojo server
getAvatar                 | Retrieves the avatar for your current Paymail
setAvatar                 | Updates the avatar for one of your Paymails on the Dojo server
getTransactions           | Retrieves a list of your transactions from the Dojo server
getTotalValue             | Retrieves the total value of your unspent outputs from the Dojo server

## API

### sendToOutputs({ xprivKey, outputs, inputSigningWIF, config }) => Promise<TXID>

### getTotalValue({ xprivbKey, config }) => Promise<Balance>

## The config Object

Each of the functions takes an optional config object as input. This object can have any of the following fields:

Name          | Description
--------------|-----------------------------
dojoServerURL | The URL of the Dojo to use

## Testing

Adequate testing practices for use in a critical production application should be observed at all times for this library.

## Confidentiality

This is proprietary software developed and owned by Peer-to-peer Privacy Systems Research, LLC. 
Except as provided for in your CWI Partner Agreement with us, you may not use this software and 
must keep it confidential.