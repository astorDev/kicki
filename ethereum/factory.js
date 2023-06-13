import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const address = process.env.NEXT_PUBLIC_KICKI_FACTORY_CONTRACT_ADDRESS
console.log(`creating campaign factory client with address ${address}`)

const factoryClient = new web3.eth.Contract(CampaignFactory.abi, address);

export default factoryClient;