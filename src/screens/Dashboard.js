import React, { useEffect, useState } from "react";
import { provider, EFIKCOIN_ADDRESS, EFIKCOIN_ABI } from "../utils/web3";
import { loadWallet } from "../wallet/storage";
import { ethers } from "ethers";

export default function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [efcBalance, setEfcBalance] = useState("0");

  useEffect(() => {
    const w = loadWallet();
    setWallet(w);
    if (w) loadBalance(w);
  }, []);

  async function loadBalance(w) {
    const contract = new ethers.Contract(EFIKCOIN_ADDRESS, EFIKCOIN_ABI, provider);
    const bal = await contract.balanceOf(w.address);
    setEfcBalance(ethers.utils.formatUnits(bal, 18));
  }

  if (!wallet) return <div>No wallet found</div>;

  return (
    <div>
      <h1>EFIKCOIN Wallet</h1>
      <p>Address: {wallet.address}</p>
      <p>Balance: {efcBalance} EFC</p>
    </div>
  );
}
