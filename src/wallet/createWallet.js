import { ethers } from "ethers";

export function createWallet() {
  const wallet = ethers.Wallet.createRandom();
  localStorage.setItem("efik_wallet", wallet.privateKey);
  return wallet;
}
