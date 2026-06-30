import { ethers } from "ethers";

export const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);

export const EFIKCOIN_ADDRESS = "0x677Ce9CBa67f7484ea951a12897CE780cFd8fED1";

export const EFIKCOIN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];
