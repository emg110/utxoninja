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
createOutgoingTransaction  | A lower-level function that uses the Dojo endpoint to obtain a list of selected inputs, change outputs and a reference number. Using getTransactionWithOutputs is recommended in place of this function, because it also handles input signing.
processOutgoingTransaction | Marks transaction inputs as spent and activates transaction change outputs

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
- **feePerKb**: The fee in satoshis per KB. Other fee models may be added in the future as they are developed

#### Return Value

The return value is a Promise for an object with two fields:

- **hex**: The transaction hex string
- **reference**: The reference that you need to provide to processOutgoingTransaction after it has been accepted by the recipient and broadcasted

### `processOutgoingTransaction({ xprivKey, config, submittedTransaction, reference, recipient, note })`

After using getTransactionWithOutputs (or, less conveniently, createOutgoingTransaction), use this function to notify the Dojo of the submitted transaction. This is a required step whenever you create transactions, and it will allow the Dojo to do the following:

- Mark the inputs to the transaction as spent, so that no new transactions attempt to spend the same inputs
- Activate the change outputs that were created when you created the outgoing transaction (if there are change outputs)
- Broadcast the transaction to the Bitcoin network to ensure that it will be included in a block (even if the recipient also broadcasts it)
- You can attach a note and/or a Paymail recipient to the transaction if you want, which can help with record-keeping

If this is a single-party transaction (some data, a public commitment to do something etc), you can broadcast it yourself without having to contact a recipient, since there is none. You can still add a note, but you should probably keep the recipient Paymail handle blank or undefined.

#### Parameters

- **xprivKey**: Your root xpriv key string
- **config**: The config object. See the config section for details
- **submittedTransaction**: The signed raw hex transaction string for the transaction (if you use getTransactionWithOutputs you already have this, so just give it to the recipient and once they accept it then send it back here)
- **reference**: The reference either returned from getTransactionWithOutputs or createOutgoingTransaction
- **recipient**: Optionally, you can provide the Paymail handle of the person to whom the transaction was sent. Note that Dojo won't validate this and it is just for your records.
- **note**: Optionally, provide a human-readable note that could be displayed in a UI

#### Return Value

The return value is a Promise for a success message from the Dojo server indicating that the transaction was processed.

### `createOutgoingTransaction({ xprivKey, config, requiredOutputs, foreignInputs, rPuzzleNeeded, feePerKb })`

This is a lower-level function for creating an outgoing transaction. It gives you more control, but it also makes you do more of the work yourself because you become responsible for creating, signing and serializing the transaction correctly. Normally, this would be handled by getTransactionWithOutputs.

This is useful when you need to "initially fund" your new xpriv key with foreign inputs in a special transaction. Refer to the appropriate Dojo documentation for foreign inputs.

#### Parameters

- **xprivKey**: Your root xpriv key string
- **config**: The config object. See the config section for details
- **requiredOutputs**: An array of required outputs, as per the Dojo API Documentation
- **foreignInputs**: Optionally, provide an array of foreign inputs to use. This can be combined with an empty array of required outputs to send all of the foreign input funds to "change" (i.e. fund your new key).
- **rPuzzleNeeded**: Whether one of the inputs that is selected will be required to be a P2RPH input
- **feePerKb**: The desired transaction fee in satoshis per KB. Other fee models will be added later if they are developed and made public.

#### Return Value

The return value is a Promise for the value from the createOutgoingTransaction API endpoint (selectedInputs array and changeOutputs array).

### `getSettings({ xprivKey, config })`

Returns the current receive policy settings from the Dojo. Refer to the Dojo API Documentation for a list of the receive policy fields.

#### Parameters

- **xprivKey**: Your root xpriv key string
- **config**: The config object. See the config section for details

#### Return Value

The return value is a Promise for an object that contains the fields defined by the receive policy section of the Dojo API documentation.

### `setSettings({ xprivKey, config, settings })`

Updates the receive policy settings on the Dojo. Refer to the Dojo API Documentation for a list of the receive policy fields to specify.

#### Parameters

- **xprivKey**: Your root xpriv key string
- **config**: The config object. See the config section for details
- **settings**: The object containing the new settings to apply

#### Return Value

The return value is a Promise for a success response from the Dojo indicating that the new policy has been applied.

### `getAvatar({ xprivKey, config })`

Returns the current avatar (name and poto URL) for your profile.

#### Parameters

- **xprivKey**: Your root xpriv key string
- **config**: The config object. See the config section for details

#### Return Value

The return value is a Promise for an object that contains `name` and `photoURL` fields, as defined by the Dojo API.

### `setAvatar({ xprivKey, config, name, photoURL })`

Updates the avatar (name and photo URL) on the Dojo.

#### Parameters

- **xprivKey**: Your root xpriv key string
- **config**: The config object. See the config section for details
- **name**: The name that people will see when they resolve your Paymail handle
- **photoURL**: The HTTPS or UHRP URL to a photo that people will see when they resolve your Paymail profile

#### Return Value

The return value is a Promise for a success response from the Dojo indicating that the new avatar has been saved.

### `getPaymail({ xprivKey, config })`

Returns the current Paymail handle assigned to you by the Dojo.

#### Parameters

- **xprivKey**: Your root xpriv key string
- **config**: The config object. See the config section for details

#### Return Value

The return value is a Promise for the Paymail handle given as a string.

### `setPaymail({ xprivKey, config, paymail })`

Allows you to change your Paymail handle. Note that after the change, somebody else can take your old Paymail handle. This must be done in accordance with the rules set by the Dojo you are using.

#### Parameters

- **xprivKey**: Your root xpriv key string
- **config**: The config object. See the config section for details
- **paymail**: The new Paymail handle that you want to use

#### Return Value

The return value is a Promise for a success response from the Dojo indicating that your Paymail handle has been changed.

### `getTransactions({ xprivKey, config, involving, limit, offset, orderBy })`

Returns an array of transactions, as defined by the corresponding Dojo API endpoint.

#### Parameters

- **xprivKey**: Your root xpriv key string
- **config**: The config object. See the config section for details
- **involving, limit, offset, orderBy**: See the [Dojo API docs](https://dojo.babbage.systems)

#### Return Value

The return value is a Promise for an array of transaction objects.

### `getTotalValue({ xprivKey, config })`

Returns the total of all unspent outputs managed by the Dojo.

#### Parameters

- **xprivKey**: Your root xpriv key string
- **config**: The config object. See the config section for details

#### Return Value

The return value is a Promise for an object containing the number of satoshis.

## Testing

Adequate testing practices for use in a critical production application should be observed at all times for this library.

While this is not a React application, the react-scripts package is used for testing. I tried to get Jest to work on its own with the Web Cryptography API, TextEncoder and TextDecoder, but was unable to find a suitable configuration. If anyone can get the tests to pass with only Jest, please feel free to create a pull request.

## License

The license for this library, which is a wrapper for the proprietary Dojo API, is the Open BSV License. It can only be used on the BSV blockchain. The Dojo API itself, including the rights to create and host Dojo servers or any other related infrastructure, is not covered by the Open BSV License and remains proprietary and restricted. The Open BSV License only extends to the code in this repository, and you are not permitted to host Dojo servers or create copies or alternative implementations of the proprietary Dojo API without other permission.
