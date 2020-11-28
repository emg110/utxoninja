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

While this is not a React application, the react-scripts package is used for testing. I tried to get Jest to work on its own with the Web Cryptography API, TextEncoder and TextDecoder, but was unable to find a suitable configuration. If anyone can get the tests to pass with only Jest, please feel free to create a pull request.

## License

The license for this library, which is a wrapper for the proprietary Dojo API, is the Open BSV License. It can only be used on the BSV blockchain. The Dojo API itself, including the rights to create and host Dojo servers or any other related infrastructure, is not covered by the Open BSV License and remains proprietary and restricted. The Open BSV License only extends to the code in this repository, and you are not permitted to host Dojo servers or create copies or alternative implementations of the proprietary Dojo API without other permission.
