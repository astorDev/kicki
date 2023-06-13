import { compileContractsFromFile } from "../solfc.js"

const contracts = compileContractsFromFile("Contracts", import.meta.url, "Campaign.sol")
export const campaignContract = contracts["Campaign"]
export const campaignFactoryContract = contracts["CampaignFactory"]