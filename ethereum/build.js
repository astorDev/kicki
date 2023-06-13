import { campaignContract, campaignFactoryContract } from "./compile.js";
import { fileURLToPath } from 'url';
import { resolve, dirname } from "path";
import fse from "fs-extra";
const { removeSync, ensureDirSync, outputJsonSync } = fse;

const currentDir = dirname(fileURLToPath(import.meta.url))
const buildPath = resolve(currentDir, 'build');

removeSync(buildPath);
ensureDirSync(buildPath);

outputJsonSync(
    resolve(buildPath, "Campaign.json"),
    campaignContract
);

outputJsonSync(
    resolve(buildPath, "CampaignFactory.json"),
    campaignFactoryContract
);