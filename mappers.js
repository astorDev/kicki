import web3 from "./ethereum/web3"

export function mapRequest(source, index) {
    return {
        id : index,
        description : source.description,
        value : web3.utils.fromWei(source.value, "ether").toString(),
        recipient: source.recipient,
        complete : source.complete,
        approvalCount : source.approvalCount.toString()
    }
}