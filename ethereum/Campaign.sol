// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.20;

contract CampaignFactory {
    struct CampaignSummary {
        address campaignAddress;
        string name;
    }

    CampaignSummary[] public campaigns;
    address[] public deployedCampaigns;

    function createCampaign(uint minimumContribution, string memory name) public {
        address newCampaignAddress = address(new Campaign(minimumContribution, msg.sender, name));
        deployedCampaigns.push(newCampaignAddress);

        CampaignSummary storage summary = campaigns.push();
        summary.name = name;
        summary.campaignAddress = newCampaignAddress;
    }

    function getCampaigns() public view returns (CampaignSummary[] memory) {
        return campaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public admin;
    uint public minimumContribution;
    string public name;
    mapping(address => bool) public approvers;
    uint public approversCount;

    constructor(uint _minimumContribution, address creator, string memory name) {
        admin = creator;
        minimumContribution = _minimumContribution;
        name = name;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    modifier restricted() {
        require(msg.sender == admin);
        _;
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted payable {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
    }

    function approveRequest(uint index) public payable {
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvalCount++;
        request.approvals[msg.sender] = true;
    }

    function finalizeRequest(uint index) public restricted payable {
        Request storage request = requests[index];

        require(request.approvalCount >= approversCount / 2);
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            admin
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function getActions(uint requestIndex) public view returns (string memory, string memory) {
        return (
            getCompleteAction(msg.sender, requestIndex),
            getApproveAction(msg.sender, requestIndex)
        );
    }

    function getCompleteAction(address sender, uint requestIndex) private view returns (string memory) {
        Request storage request = requests[requestIndex];

        if (request.complete) {
            return "done";
        }

        if (sender != admin) {
            return "none";
        }

        if (request.approvalCount < approversCount / 2) {
            return "missing:approvers";
        }

        if (request.value > address(this).balance) {
            return "missing:balance";
        }

        if (request.complete) {
            return "done";
        } else {
            return "pending";
        }
    }

    function getApproveAction(address sender, uint requestIndex) private view returns (string memory) {
        Request storage request = requests[requestIndex];

        if (request.complete) {
            return "none";
        }

        if (!approvers[sender]) {
            return "none";
        }

        if (request.approvals[sender]) {
            return "done";
        }

        return "pending";
    }
}