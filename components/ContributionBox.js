import { Form, Input, Message, Button } from "semantic-ui-react";
import { useState } from "react";
import campaignClient from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import routes from '../routes'

export default function ContributionBox({ address }) {
    const [ value, setValue ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ loading, setLoading ] = useState(false);
    
    const onSubmit = async (e) => {
        e.preventDefault();

        const campaign = campaignClient(address);

        setLoading(true)
        setErrorMessage('')

        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.contribute().send({
                value: web3.utils.toWei(value, 'ether'),
                from: accounts[0]
            })

            routes.Router.replaceRoute(`/campaigns/${address}`)
        } catch (err) {
            console.log(err)
            setErrorMessage(err.message)
        }

        setLoading(false)
        setValue(0)
    };

    return (
        <Form onSubmit={onSubmit} error={!!errorMessage}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    label="ether"
                    labelPosition="right" 
                />
            </Form.Field>
            <Message error header="Oops!" content={errorMessage} />
            <Button primary loading={loading}>Contribute!</Button>
        </Form>
    )
}