import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

function Stake() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState("");
  const [staked, setStaked] = useState("0");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      console.log("Connected address:", address); // DEBUG
      setWalletAddress(address);

      const heliosContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(heliosContract);

      const stakedAmount = await heliosContract.getStakedAmount(address);
      setStaked(ethers.formatEther(stakedAmount));
    } catch (err) {
      console.error("Connect wallet error:", err);
      alert("Failed to connect wallet");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Stake HLS Token</h2>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Wallet: {walletAddress}</p>
          <p>Total Staked: {staked} HLS</p>
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: 8, marginRight: 12 }}
          />
          <button onClick={() => contract?.stake(ethers.parseEther(amount))}>Stake</button>
          <button onClick={() => contract?.withdraw(ethers.parseEther(amount))}>Withdraw</button>
        </>
      )}
    </div>
  );
}

export default Stake;

