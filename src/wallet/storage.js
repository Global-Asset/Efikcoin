import { ethers } from "ethers";

export function loadWallet() {
  const pk = localStorage.getItem("efik_wallet");
  if (!pk) return null;
  return new ethers.Wallet(pk);
}
