import { ethers } from "ethers";

export function importWallet(mnemonic) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  localStorage.setItem("efik_wallet", wallet.privateKey);
  return wallet;
}
