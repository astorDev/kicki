import { Message, Table, Button, Tab, Loader, Popup, Icon } from "semantic-ui-react"
import campaignClient from "../ethereum/campaign";
import { useEffect, useState } from "react";
import web3 from "../ethereum/web3";

export function RequestHeader() {
    return (
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell>Recipient</Table.HeaderCell>
                <Table.HeaderCell>Approvals</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
        </Table.Header>
    )
}

export function RequestRow({ id, address }) {

    const [ request, setRequest ] = useState({})
    const [ loadingMessage, setLoadingMessage ] = useState('Loading...')
    const [ errorMessage, setErrorMessage ] = useState('')

    const getRequest = async () => {

        setLoadingMessage('Loading...')
        setErrorMessage('')
        const campaign = campaignClient(address)

        try {
            const accounts = await web3.eth.getAccounts()
            const request = await campaign.methods.requests(id).call()
            const approversCount = await campaign.methods.approversCount().call()
            const actions = await campaign.methods.getActions(id).call({ from: accounts[0] })

            console.log(request)
            console.log(actions)

            setRequest({
                id: request.id,
                description: request.description,
                amount : web3.utils.fromWei(request.value, "ether").toString(),
                recipient: request.recipient,
                approvalCount: `${request.approvalCount} / ${approversCount}`,
                complete: actions[0],
                approve : actions[1],
            })
        }
        catch(err) {
            setErrorMessage(err.message)
        }

        setLoadingMessage('')
    }

    const onApprove = async () => {
        const campaign = campaignClient(address)
        
        setLoadingMessage('Approving...')
        setErrorMessage('')

        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.approveRequest(id).send({
                from: accounts[0]
            })

        } catch (err) {
            console.log(err)
            setErrorMessage(err.message)
        }

        await getRequest()
    }

    const onComplete = async () => {
        const campaign = campaignClient(address)
        
        setLoadingMessage('Finalizing...')
        setErrorMessage('')

        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.finalizeRequest(id).send({
                from: accounts[0]
            })

        } catch (err) {
            console.log(err)
            setErrorMessage(err.message)
        }

        await getRequest()
    }

    useEffect(() => {
        getRequest()
    }, [ id ])

    if (loadingMessage) {
        return (
            <Table.Row>
                <Table.Cell colSpan="1" >
                    <Loader active inline />
                </Table.Cell>
                <Table.Cell colSpan="2">
                    <h5>{loadingMessage}</h5>
                </Table.Cell>
            </Table.Row>
        )
    }

    if (errorMessage) {
        return (
            <Table.Row>
                <Table.Cell >
                    {id}
                </Table.Cell>
                <Table.Cell colSpan="4">
                    <Message error content={errorMessage} />
                </Table.Cell>
                <Table.Cell colSpan="2">
                    <Button icon="refresh" content="Refresh" primary onClick={getRequest} />
                </Table.Cell>
            </Table.Row>
        )
    }

    return (
        <Table.Row>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>{request.description}</Table.Cell>
            <Table.Cell>{request.amount}</Table.Cell>
            <Table.Cell>{request.recipient}</Table.Cell>
            <Table.Cell>{request.approvalCount}</Table.Cell>
            <ActionCell 
                status={request.approve}
                content="Approve" 
                activeColor='green'
                onClick={onApprove}
                doneContent="Approved"
            />
            <ActionCell 
                status={request.complete} 
                content="Complete" 
                activeColor='blue' 
                onClick={onComplete}
                doneContent="Completed"
            />
        </Table.Row>
    )
}

export function ActionCell({ status, content, activeColor, onClick, doneContent }) {
    if (status == 'none') {
        return (
            <Table.Cell/>
        )
    }

    if (status == 'done') {
        return (
            <Table.Cell>
                <Message positive >
                    <Icon name="check" />
                    {doneContent}
                </Message>
            </Table.Cell>
        )
    }

    const disabled = status.startsWith("missing:") 
    const tooltip = status.replace('missing:', '')
    const color = disabled ? '' : activeColor

    console.log(tooltip)

    return (
        <Table.Cell>
            <Popup
                content={`not enough ${tooltip}`}
                disabled={!disabled}
                trigger={
                    <Button 
                        content={content} 
                        color={color} 
                        onClick={onClick} 
                    />
                }
            />
        </Table.Cell>
    )
}