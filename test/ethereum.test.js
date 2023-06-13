import { ok, equal } from 'assert';
import ganache from 'ganache';
import Web3 from 'web3';
import { campaignContract, campaignFactoryContract } from "../ethereum/compile.js"

const web3 = new Web3(ganache.provider());

let campaign
let campaignClient
let factoryClient
let accounts

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    factoryClient = await new web3.eth.Contract(campaignFactoryContract.abi)
        .deploy({ data: campaignFactoryContract.evm.bytecode.object })
        .send({ from: accounts[0], gas: 10000000 });

    await factoryClient.methods.createCampaign(100, "c1").send({
        from: accounts[0],
        gas: 10000000
    })

    var deployedCampaigns = await factoryClient.methods.getCampaigns().call();
    campaign = deployedCampaigns[0];
    campaignClient = new web3.eth.Contract(campaignContract.abi, campaign.campaignAddress);
})

describe('Campaign', () => {
    it('deploys', async () => {
        console.log(campaignClient)

        ok(campaignClient.options.address);
    })

    it('returns campaigns list', async () => {
        var deployedCampaigns = await factoryClient.methods.getCampaigns().call();
        equal(deployedCampaigns.length, 1);
        equal(deployedCampaigns[0].name, "c1");
    })

    it('sets minimum contribution', async () => {
        const minimum = await campaignClient.methods.minimumContribution().call();
        equal(minimum, 100);
    })

    it('allows big contribution', async () => {
        await campaignClient.methods.contribute().send({
            value: 200000,
            from: accounts[0]
        })

        ok(await campaignClient.methods.approvers(accounts[0]).call());
    })

    it('allows contribute exactly minimum', async () => {
        await campaignClient.methods.contribute().send({
            value: 100,
            from: accounts[0]
        })

        ok(await campaignClient.methods.approvers(accounts[0]).call());
    })

    it('requires minimum contribution', async() => {
        try {
            await campaignClient.methods.contribute().send({
                value: 99,
                from: accounts[0]
            })
            ok(false);
        } catch (err) {
            ok(err);
        }
    })

    it('allows admin to make request', async () => {
        await campaignClient.methods.createRequest("Buy batteries", 100, accounts[1]).send({
            from: accounts[0],
            gas: 1000000
        })

        const request = await campaignClient.methods.requests(0).call();
        equal(request.description, "Buy batteries");
    })

    it('forbids outsider approval', async () => {
        await campaignClient.methods.createRequest("Buy batteries", 100, accounts[1]).send({
            from: accounts[0],
            gas: 1000000
        })

        try {
            await campaignClient.methods.approveRequest(0).send({
                from: accounts[1],
                gas: 1000000
            })
            ok(false);
        } catch (err) {
            ok(err);
        }
    })

    it('allows contributor approval', async () => {
        await campaignClient.methods.contribute().send({
            value: 200000,
            from: accounts[0]
        })

        await campaignClient.methods.createRequest("Buy batteries", 100, accounts[1]).send({
            from: accounts[0],
            gas: 1000000
        })

        await campaignClient.methods.approveRequest(0).send({
            from: accounts[0],
            gas: 1000000
        })

        const request = await campaignClient.methods.requests(0).call();
        equal(request.approvalCount, 1);
    })

    it('forbids double approval', async () => {
        await campaignClient.methods.contribute().send({
            value: 200000,
            from: accounts[0]
        })

        await campaignClient.methods.createRequest("Buy batteries", 100, accounts[1]).send({
            from: accounts[0],
            gas: 1000000
        })

        await campaignClient.methods.approveRequest(0).send({
            from: accounts[0],
            gas: 1000000
        })

        try {
            await campaignClient.methods.approveRequest(0).send({
                from: accounts[0],
                gas: 1000000
            })
            ok(false);
        } catch (err) {
            ok(err);
        }
    })

    it('forbids unapproved request finalization', async () => {
        await campaignClient.methods.contribute().send({
            value: 200000,
            from: accounts[0]
        })

        await campaignClient.methods.createRequest("Buy batteries", 100, accounts[1]).send({
            from: accounts[0],
            gas: 1000000
        })

        try {
            await campaignClient.methods.finalizeRequest(0).send({
                from: accounts[0],
                gas: 1000000
            })
            ok(false);
        } catch (err) {
            ok(err);
        }
    })

    it ('forbids request finalization by non-admin', async () => {
        await campaignClient.methods.contribute().send({
            value: 200000,
            from: accounts[0]
        })

        await campaignClient.methods.createRequest("Buy batteries", 100, accounts[1]).send({
            from: accounts[0],
            gas: 1000000
        })

        await campaignClient.methods.approveRequest(0).send({
            from: accounts[0],
            gas: 1000000
        })

        try {
            await campaignClient.methods.finalizeRequest(0).send({
                from: accounts[1],
                gas: 1000000
            })
            ok(false);
        } catch (err) {
            ok(err);
        }
    })

    it('allows request finalization', async () => {
        await campaignClient.methods.contribute().send({
            value: 200000,
            from: accounts[0]
        })

        await campaignClient.methods.createRequest("Buy batteries", 100, accounts[1]).send({
            from: accounts[0],
            gas: 1000000
        })

        await campaignClient.methods.approveRequest(0).send({
            from: accounts[0],
            gas: 1000000
        })

        await campaignClient.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: 1000000
        })

        const request = await campaignClient.methods.requests(0).call();
        equal(request.complete, true);
    })

    it('forbids completed request finalization', async () => {
        await campaignClient.methods.contribute().send({
            value: 200000,
            from: accounts[0]
        })

        await campaignClient.methods.createRequest("Buy batteries", 100, accounts[1]).send({
            from: accounts[0],
            gas: 1000000
        })

        await campaignClient.methods.approveRequest(0).send({
            from: accounts[0],
            gas: 1000000
        })

        await campaignClient.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: 1000000
        })

        try {
            await campaignClient.methods.finalizeRequest(0).send({
                from: accounts[0],
                gas: 1000000
            })
            ok(false);
        } catch (err) {
            ok(err);
        }
    })
})