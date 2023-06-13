# Kicki

Kick-starter on smart contracts. Custom take on [Ethereum and solidity: The Complete Developer Guide](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/) course project. What's different from the original project:

- The most recent version of Solidity
- Uses Sepolia faucet instead of outdated Rinkeby
- Helper solidity functions file [solfc.json](solfc.json)
- The most recent versions of node packages
- Modern react syntax
- Campaign name
- Actions permission control for campaign requests

![](docs/short.mov)

## Getting Started

### Get your Sepolia wallet ready

Make sure [Metamask](https://metamask.io/) is installed and running on your browser.

| :warning: WARNING          |
|:---------------------------|
| Don't use your real wallet! Create a new metamask account with new mnemonic seed      |

```bash
export NEXT_PUBLIC_KICKI_WALLET_MNEMONIC="your mnemonic phrase"
```

Find a Sepolia faucet and get some test sepoliaETH to your wallet. [This](https://sepolia-faucet.pk910.de/) faucet is working at the time of writing.

### Get your Sepolia node URL

By the time of writing [Infura](https://www.infura.io/) provides a free node for you.

```bash
export NEXT_PUBLIC_KICKI_NODE_URL=<URL from infura>
```

### Install dependencies

This is a node js project so at first make sure we install all the dependencies first.
To avoid version conflict between react and next-routes use --force flag:

```bash
npm install --force
```

If everything is setup correctly you should be able to get successful test results:

```bash
npm run test
```

### Build and deploy contracts

First, we'll need an abi and bytecode of contracts in the Ethereum build folder. To do that run:

```bash
node ethereum/build
```

Then we'll need to deploy the contracts to the Sepolia network. To do that run:

```bash
node ethereum/deploy
```

The deploy script should write the deployed contract address. Copy it and

```bash
export NEXT_PUBLIC_KICKI_FACTORY_CONTRACT_ADDRESS=<deployed contract address>
```

### Run the app

If everything is setup correctly you should be able to run the app on port 3000:

```bash
npm run dev
```