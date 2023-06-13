import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { attempt } from '../attempt.js';
 
import { campaignFactoryContract } from './compile.js';

const mnemonic = process.env.NEXT_PUBLIC_KICKI_WALLET_MNEMONIC;
const nodeUrl = process.env.NEXT_PUBLIC_KICKI_NODE_URL;

if (mnemonic === undefined) {
  console.log("NEXT_PUBLIC_KICKI_WALLET_MNEMONIC is not set" );
}

if (nodeUrl === undefined) {
  console.log("NEXT_PUBLIC_KICKI_NODE_URL is not set" );
}

console.log(`creating web3 client with mnemonic "${mnemonic}" and node url "${nodeUrl}"`)

const provider = new HDWalletProvider(
  process.env.NEXT_PUBLIC_KICKI_WALLET_MNEMONIC,
  process.env.NEXT_PUBLIC_KICKI_NODE_URL
);
 
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Deploying campaign factory from account', accounts[0]);

  const contract = new web3.eth.Contract(campaignFactoryContract.abi)
  const deploymentAttempt = await attempt(async function() {
    return await contract.deploy({ data: campaignFactoryContract.evm.bytecode.object, arguments: [] }).send({ gas: '10000000', from: accounts[0] });
  }, 5);
  
  if (deploymentAttempt.error) {
    console.log("error deploying contract: " + deploymentAttempt.error.message);
    return;
  }

  console.log(JSON.stringify(campaignFactoryContract.abi));
  console.log('Contract deployed to', deploymentAttempt.result.options.address);
  provider.engine.stop();
};
deploy();