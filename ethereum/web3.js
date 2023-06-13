import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  console.log("Getting from browser metamask")

  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  console.log("Getting from infura")

  const provider = new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/045086e403424b4f8c2109df000d767e"
  );

  web3 = new Web3(provider);
}

export default web3;