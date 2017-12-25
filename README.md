# Loopring Protocol Javascript Library

**Development ongoing**

## Environment

You need to install [npm](https://www.npmjs.com/get-npm), [yarn](https://yarnpkg.com/lang/en/docs/cli/install/), and [webpack](https://github.com/webpack/webpack).

Then run the following commands from project's root directory:
 
```
yarn install
// or

npm install
```

## Develop

```
npm run start
```

## Build

```
npm run build
```


## Test

```
npm run build
```

## Browser Usage

To save on space in the library, and allow for dependencies to be concurrently loaded by a browser, we have removed the following libraries (they will need to be installed via bower):

```
async
axios
bignumber.js
bn.js
lodash
```

Include the following script tags in your HTML:

```
<script src="../bower_components/async/dist/async.js"></script>
<script src="../bower_components/axios/dist/axios.min.js"></script>
<script src="../bower_components/bignumber.js/bignumber.min.js"></script>
<script src="../node_modules/bn.js/lib/bn.js"></script>
<script src="../bower_components/lodash/dist/lodash.min.js"></script>
<script src="../bower_components/loopring.js/dist/loopring.min.js"></script>
```

To use the library in your JavaSrcipt code, get each component like so:

```
const Keystore = this.keystore;
const PrivateKeyWallet = this.wallet;
const Validator = this.validator;
const Signer = this.signer;
const Relay = this.relay;
const Order = this.order;
```

## Developers

Before commit your changes or submit a pull request, please lint your code by running:

```
./node_modules/.bin/eslint . --fix
webpack
```
