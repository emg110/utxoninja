# utxoninja

Management for P2PKH and P2RPH UTXOs

[NPM](https://www.npmjs.com/package/utxoninja)

Refer to the [Dojo API docs](https://dojo.babbage.systems) for additional useful information.

## Exported Functions

Name                       | Description
---------------------------|-----------------------------
getTransactionWithOutputs  | Creates and returns a new transaction spending to a specific set of output scripts
getSettings                | Retrieves the settings from the Dojo server
setSettings                | Updates the settings on the Dojo server
getPaymail                 | Retrieves your current Paymail from the Dojo server
setPaymail                 | Sets a new Paymail on the Dojo server
getAvatar                  | Retrieves the avatar for your current Paymail
setAvatar                  | Updates the avatar for one of your Paymails on the Dojo server
getTransactions            | Retrieves a list of your transactions from the Dojo server
getTotalValue              | Retrieves the total value of your unspent outputs from the Dojo server
createOutgoingTransaction  |
processOutgoingTransaction |

## The config Object

Each of the functions takes an optional config object as input. This object can have any of the following fields:

- **dojoURL**: The URL of the Dojo to use (default https://dojo.babbage.systems)

### `getTransactionWithOutputs({ xprivKey, config, outputs, rPuzzleInputSigningWIF, feePerKb })`

Given a set of required outputs, returns a signed transaction hex and a reference number.

You should submit the transaction hex to the transaction recipient, and once it has been accepted and broadcasted to the Bitcoin network, you need to use the processOutgoingTransaction function to mark the redeemed inputs as spent and activate the change outputs.

This function will not broadcast the raw transaction, because the transaction should be broadcasted by the recipient after they examine and accept it.

#### Parameters

- **xprivKey**: Your root xpriv key string
- **config**: The config object. See the config section for details
- **outputs**: An array of transaction outputs to include
- **outputs[element].script**: Hex string representing transaction output script hex
- **outputs[element].satoshis**: The number of satoshis for the output. Can be zero for data outputs
- **rPuzzleInputSigningWIF**: A WIF key which, if provided, will require that the transaction redeems at least one R-puzzle input, and signs the unlocking script for that input with the specified key
- **feePerKb**: The fee in satohis per KB. Other fee models may be added in the future as they are developed

#### Return Value

The return value is an object with two fields:

- **hex**: The transaction hex string
- **reference**: The reference that you need to provide for the processOutgoingTransaction after it has been accepted by the recipient and broadcasted

## Testing

Adequate testing practices for use in a critical production application should be observed at all times for this library.

While this is not a React application, the react-scripts package is used for testing. I tried to get Jest to work on its own with the Web Cryptography API, TextEncoder and TextDecoder, but was unable to find a suitable configuration. If anyone can get the tests to pass with only Jest, please feel free to create a pull request.

## License

The license for this library, which is a wrapper for the proprietary Dojo API, is the Open BSV License. It can only be used on the BSV blockchain. The Dojo API itself, including the rights to create and host Dojo servers or any other related infrastructure, is not covered by the Open BSV License and remains proprietary and restricted. The Open BSV License only extends to the code in this repository, and you are not permitted to host Dojo servers or create copies or alternative implementations of the proprietary Dojo API without other permission.
