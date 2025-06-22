import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./constants/contract";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const [addr] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(addr);
    } else {
      alert("MetaMask tidak ditemukan");
    }
  };

  const getMessage = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const msg = await contract.message();
    setMessage(msg);
  };

  const updateMessage = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.updateMessage(input);
    await tx.wait();
    getMessage();
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
      getMessage();
    }
  }, []);

  return (
    <div style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1>🚀 HelloHelios UI</h1>
      <p><strong>Wallet:</strong> {walletAddress}</p>
      <p><strong>Current Message:</strong> {message}</p>

      <input
        type="text"
        placeholder="Tulis pesan baru"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: 8, width: "300px", marginRight: 8 }}
      />
      <button onClick={updateMessage}>Update Message</button>
    </div>
  );
}

export default App;

