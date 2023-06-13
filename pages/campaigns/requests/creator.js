import Layout from "../../../components/Layout";
import { Form, Button, Message, Input } from "semantic-ui-react";
import { useState } from "react";
import CampaignClient from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import routes from "../../../routes";

RequestCreator.getInitialProps = async (props) => {
    return {
        address: props.query.address
    }
};

export default function RequestCreator({ address }) {
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [recipient, setRecipient] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage("");

        const campaign = CampaignClient(address);

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description, web3.utils.toWei(value, "ether"), recipient).send({
                from: accounts[0]
            });
        }
        catch (err) {
            setErrorMessage(err.message);    
        }

        setLoading(false);
        routes.Router.pushRoute(`/campaigns/${address}/requests`);
    };

    return (
        <Layout>
            <h3>Create a Request</h3>
            <Form error={!!errorMessage} onSubmit={onSubmit}>
                <Form.Field>
                    <label>Description</label>
                    <Input 
                        value={description} 
                        onChange={event => setDescription(event.target.value)} 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input 
                        value={value}
                        onChange={event => setValue(event.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input 
                        value={recipient}
                        onChange={event => setRecipient(event.target.value)}
                    />
                </Form.Field>
                <Message error header="Oops!" content={errorMessage} />
                <Button loading={loading} primary>Create!</Button>
            </Form>
        </Layout>
    )
}