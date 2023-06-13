import { Card, Button } from "semantic-ui-react";
import factoryClient from "../ethereum/factory";
import Layout from '../components/Layout';
import Link from 'next/link';

App.getInitialProps = async () => {

    console.log("getting initial props");

    const campaigns = await factoryClient.methods.getCampaigns().call();
    return { campaigns };
};

export default function App({ campaigns }) {

    const renderCampaigns = () => {
        const items = campaigns.map((campaign) => ({
            header: campaign[1],
            meta: campaign[0],
            description: (
                <Link href={`/campaigns/${campaign[0]}`} content={campaign[1]}>
                    View Campaign
                </Link>
            ),
            fluid: true
        }));

        return <Card.Group items={items} />;
    }

    return (
        <Layout>
            <h3>Open Campaigns</h3>
            <Link href="/campaigns/creator">
                <Button floated="right" content="Create Campaign" icon="add circle" primary />
            </Link>
            {renderCampaigns()}
        </Layout>
    );
}