import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

export default function Stake() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [stakedAmount, setStakedAmount] = useState("0");
  const [contract, setContract] = useState(null);

  const updateStakedAmount = async (addr, ctr) => {
    try {
      const result = await ctr.getStakedAmount(addr);
      setStakedAmount(ethers.formatUnits(result, 18));
    } catch (err) {
      console.error("Update staked amount error:", err);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const ctr = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setWallet(address);
      setContract(ctr);

      // ✅ Update awal
      updateStakedAmount(address, ctr);

      // ✅ Listener untuk event Staked & Withdrawn
      ctr.on("Staked", (user, amount) => {
        if (user.toLowerCase() === address.toLowerCase()) {
          updateStakedAmount(address, ctr);
        }
      });
      ctr.on("Withdrawn", (user, amount) => {
        if (user.toLowerCase() === address.toLowerCase()) {
          updateStakedAmount(address, ctr);
        }
      });
    } catch (err) {
      console.error("Connect wallet error:", err);
    }
  };

  const stakeTokens = async () => {
    if (!contract || !amount) return;
    try {
      const tx = await contract.stake(ethers.parseUnits(amount, 18));
      await tx.wait();
      setAmount("");
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
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

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

