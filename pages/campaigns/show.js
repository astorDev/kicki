import Layout from "../../components/Layout";
import campaignClient from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributionBox from "../../components/ContributionBox";
import Link from 'next/link';

CampaignShow.getInitialProps = async (props) => {
    const campaign = campaignClient(props.query.address);

    const summary = await campaign.methods.getSummary().call();

    console.log(summary);

    return {
        minimumContribution: summary[0].toString(),
        balance: web3.utils.fromWei(summary[1], "ether").toString(),
        requestsCount: summary[2].toString(),
        approversCount: summary[3].toString(),
        manager: summary[4],
        address: props.query.address
    };
};

export default function CampaignShow({ minimumContribution, balance, requestsCount, approversCount, manager, address }) {

    const renderMetrics = () => {
        const items = [
            {
                header: manager,
                meta: "Address of Manager",
                description: "The manager created this campaign and can create requests to withdraw money",
                style: { overflowWrap: "break-word" }
            },
            {
                header: minimumContribution,
                meta: "Minimum Contribution (wei)",
                description: "You must contribute at least this much wei to become an approver"
            },
            {
                header: requestsCount,
                meta: "Number of Requests",
                description: "A request tries to withdraw money from the contract. Requests must be approved by approvers"
            },
            {
                header: approversCount,
                meta: "Number of Approvers",
                description: "Number of people who have already donated to this campaign"
            },
            {
                header: balance,
                meta: "Campaign Balance (ether)",
                description: "The balance is how much money this campaign has left to spend"
            }
        ];

        return <Card.Group items={items} />;
    };

    return (
        <Layout>
            <h3>Campaign Show</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        {renderMetrics()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributionBox address={address} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Link href={`/campaigns/${address}/requests`}>
                            <Button content="View Requests" icon="eye" primary />
                        </Link>
                    </Grid.Column>
                    <Grid.Column width={6}/>
                </Grid.Row>
            </Grid>
        </Layout>
    );
}