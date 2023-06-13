import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import factoryClient from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import routes from '../../routes'

export default () => {
    const [ minimumContribution, setMinimumContribution ] = useState(0)
    const [ name, setName ] = useState('')
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ loading, setLoading ] = useState(false)

    const onSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setErrorMessage('')

        try {
            const accounts = await web3.eth.getAccounts()
            await factoryClient.methods.createCampaign(minimumContribution, name).send({
                from: accounts[0]
            })

            routes.Router.pushRoute('/')
        } catch (err) {
            console.log(err)
            setErrorMessage(err.message)
        }

        setLoading(false)
    }

    return (
        <Layout>
            <h3>Create Campaign</h3>
            <Form onSubmit={onSubmit} error={!!errorMessage} >
                <Form.Field> 
                    <label>Name</label>
                    <Input  
                        value={name}
                        onChange={event => setName(event.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input 
                        label="wei" 
                        labelPosition="right" 
                        value={minimumContribution}
                        onChange={event => setMinimumContribution(event.target.value)}
                    />
                </Form.Field>
                <Message error header="Oops!" content={errorMessage} />
                <Button loading={loading} primary>Create!</Button>
            </Form>
        </Layout>        
    )
}