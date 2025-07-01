import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

export default function Stake() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [stakedAmount, setStakedAmount] = useState("0");
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or Rabby");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const ctr = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setWallet(address);
      setContract(ctr);
    } catch (err) {
      console.error("Connect wallet error:", err);
    }
  };

  const updateStakedAmount = async () => {
    try {
      const result = await contract.getStakedAmount(wallet);
      setStakedAmount(ethers.formatUnits(result, 18));
    } catch (err) {
      console.error("Update staked amount error:", err);
    }
  };

  const stakeTokens = async () => {
    if (!contract || !amount) return;
    try {
      const tx = await contract.stake(ethers.parseUnits(amount, 18));
      await tx.wait();
      setAmount("");
      updateStakedAmount();
    } catch (err) {
      console.error("Stake error:", err);
    }
  };

  const withdrawTokens = async () => {
    if (!contract || !amount) return;
    try {
      const tx = await contract.withdraw(ethers.parseUnits(amount, 18));
      await tx.wait();
      setAmount("");
      updateStakedAmount();
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (wallet && contract) {
      updateStakedAmount();
    }
  }, [wallet, contract]);

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h2>Stake HLS Token</h2>
      <p><strong>Wallet:</strong> {wallet || "Not connected"}</p>
      <p><strong>Total Staked:</strong> {stakedAmount} HLS</p>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: "10px", padding: "0.5rem" }}
      />
      <br /><br />
      <button onClick={stakeTokens} style={{ marginRight: "10px", padding: "0.5rem 1rem" }}>
        Stake
      </button>
      <button onClick={withdrawTokens} style={{ padding: "0.5rem 1rem" }}>
        Withdraw
      </button>
    </div>
  );
}

