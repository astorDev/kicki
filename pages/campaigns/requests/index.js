import { Button, Table, Message } from "semantic-ui-react"
import Layout from "../../../components/Layout"
import Link from 'next/link'
import campaignClient from "../../../ethereum/campaign";
import { RequestRow, RequestHeader } from "../../../components/RequestRow";
import { attempt } from "../../../attempt";

RequestsIndex.getInitialProps = async (props) => {
    const address = props.query.address

    let { result, error } = await attempt(
        async function() { 
            console.log("building campaign client")
            const campaign = campaignClient(address);
            console.log("getting requests count")
            const count = await campaign.methods.getRequestsCount().call() 
            console.log("got requests count of " + count)
            return count;
        }, 5);
    
    return {
        address: props.query.address,
        requestsCount: result?.toString(),
        errorMessage : error?.message,
    };
};

export default function RequestsIndex({ address, requestsCount, errorMessage }) {
    const ids = Array.from({ length: requestsCount }, (_, i) => i);

    return (
        <Layout>
            <h3>Requests</h3>
            <h5>
                Found {requestsCount} request from campaign{" "}
                <Link href={`/campaigns/${address}`}>
                    {address}
                </Link>
            </h5>
            <p>{errorMessage}</p>
            <Message hidden={!errorMessage} error header="Oops!" content={errorMessage} />
            <Table>
                <RequestHeader />
                <Table.Body>
                    {ids.map((id) => {
                        return <RequestRow id={id} address={address} />
                    })}
                </Table.Body>
            </Table>
                <Link href={`/campaigns/${address}/requests/creator`}>
                    <Button primary>Add Request</Button>
                </Link>
        </Layout>
    )
}

// async function attempt(asyncFn, maxAttempts) {
//   let attempts = 0;

//   while (attempts < maxAttempts) {
//     try {
//       const result = await asyncFn();
//       return { 
//         result: result,
//         error: null
//       }
//     } catch (error) {
//       attempts++;
//       if (attempts === maxAttempts) {
//         return {
//             result: null,
//             error: error
//         }
//       }
//     }
//   }
// }