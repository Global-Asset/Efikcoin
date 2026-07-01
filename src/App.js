// App.js
import React, { useState } from "react";
import { ethers } from "ethers";

// BNB Smart Chain + EFIKCOIN
const RPC_URL = "https://bsc-dataseed.binance.org/";
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const EFIKCOIN_ADDRESS = "0x677Ce9CBa67f7484ea951a12897CE780cFd8fED1";
const EFIKCOIN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
];

function SplashScreen() {
  return (
    <div className="container splash">
      <h1>EFIKCOIN Wallet</h1>
      <p className="subtitle">Your Keys. Your Planet. Your Future.</p>
    </div>
  );
}

function OnboardingScreen({ onCreateWallet, onImportWallet }) {
  return (
    <div className="container">
      <h1>Welcome to EFIKCOIN Wallet</h1>
      <p>
        Self‑custodian wallet for EFIKCOIN (EFC) on BNB Smart Chain. No organisation, no middleman—just you.
      </p>
      <button onClick={onCreateWallet} className="btn btn-primary">
        Create New Wallet
      </button>
      <button onClick={onImportWallet} className="btn btn-secondary">
        Import Existing Wallet
      </button>
      <p className="info">
        EFIKCOIN is a digital planet ecosystem token built on BNB Smart Chain.
      </p>
    </div>
  );
}

function CreateWalletScreen({ onWalletCreated }) {
  const [mnemonic, setMnemonic] = useState("");

  const handleCreate = () => {
    const newWallet = ethers.Wallet.createRandom();
    setMnemonic(newWallet.mnemonic.phrase);
    localStorage.setItem("efikcoin_wallet", JSON.stringify({
      address: newWallet.address,
      mnemonic: newWallet.mnemonic.phrase
    }));
  };

  return (
    <div className="container">
      <h1>Create New Wallet</h1>
      <p>
        This will generate a new EFIKCOIN wallet with a unique seed phrase. Write it down and keep it safe.
      </p>
      <button onClick={handleCreate} className="btn btn-primary">
        Generate Wallet
      </button>
      {mnemonic && (
        <div className="seed-phrase">
          <h2>Your Seed Phrase:</h2>
          <div className="mnemonic-box">{mnemonic}</div>
          <p className="warning">
            Never share this phrase. EFIKCOIN Wallet cannot recover it if lost.
          </p>
          <button onClick={() => onWalletCreated()} className="btn btn-primary">
            Continue to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

function ImportWalletScreen({ onWalletImported }) {
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState("");

  const handleImport = () => {
    try {
      const wallet = ethers.Wallet.fromMnemonic(mnemonic.trim());
      localStorage.setItem("efikcoin_wallet", JSON.stringify({
        address: wallet.address,
        mnemonic: wallet.mnemonic.phrase
      }));
      alert("Wallet imported successfully.");
      onWalletImported();
    } catch (e) {
      setError("Invalid seed phrase.");
    }
  };

  return (
    <div className="container">
      <h1>Import Wallet</h1>
      <p>
        Paste your 12/24‑word seed phrase to restore your EFIKCOIN wallet.
      </p>
      <textarea
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
        placeholder="Enter your seed phrase here..."
        className="input"
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleImport} className="btn btn-primary">
        Restore Wallet
      </button>
    </div>
  );
}

function DashboardScreen({ wallet, onSend, onReceive, onLogout }) {
  const [efcBalance, setEfcBalance] = useState("0");
  const [bnbBalance, setBnbBalance] = useState("0");

  React.useEffect(() => {
    const loadBalances = async () => {
      if (!wallet) return;
      try {
        const efcContract = new ethers.Contract(EFIKCOIN_ADDRESS, EFIKCOIN_ABI, provider);
        const bal = await efcContract.balanceOf(wallet.address);
        setEfcBalance(ethers.utils.formatUnits(bal, 18));

        const nativeBal = await provider.getBalance(wallet.address);
        setBnbBalance(ethers.utils.formatEther(nativeBal));
      } catch (e) {
        console.error("Failed to load balances:", e);
      }
    };
    loadBalances();
  }, [wallet]);

  if (!wallet) {
    return <p>No wallet loaded.</p>;
  }

  const shortAddress = wallet.address.slice(0, 6) + "..." + wallet.address.slice(-4);

  return (
    <div className="container dashboard">
      <h1>EFIKCOIN Dashboard</h1>
      <p className="address">Address: {shortAddress}</p>

      <div className="balances">
        <div className="balance-card">
          <h3>EFIKCOIN (EFC)</h3>
          <p>{efcBalance}</p>
        </div>
        <div className="balance-card">
          <h3>BNB</h3>
          <p>{bnbBalance}</p>
        </div>
      </div>

      <div className="button-group">
        <button onClick={onSend} className="btn btn-primary">
          Send
        </button>
        <button onClick={onReceive} className="btn btn-secondary">
          Receive
        </button>
      </div>

      <button onClick={onLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
}

function SendScreen({ wallet, onBack }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!wallet) {
      alert("No wallet loaded.");
      return;
    }
    try {
      setLoading(true);
      const signer = wallet.connect(provider);
      const contract = new ethers.Contract(EFIKCOIN_ADDRESS, EFIKCOIN_ABI, signer);
      const tx = await contract.transfer(recipient, ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      alert("Success! Transaction sent: " + tx.hash);
      setRecipient("");
      setAmount("");
    } catch (e) {
      alert("Error: Failed to send EFIKCOIN. " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Send EFIKCOIN</h1>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient address"
        className="input"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="input"
      />
      <button onClick={handleSend} disabled={loading} className="btn btn-primary">
        {loading ? "Sending..." : "Send EFIKCOIN"}
      </button>
      <button onClick={onBack} className="btn btn-secondary">
        Back
      </button>
    </div>
  );
}

function ReceiveScreen({ wallet, onBack }) {
  if (!wallet) {
    return (
      <div className="container">
        <p>No wallet loaded.</p>
        <button onClick={onBack} className="btn btn-secondary">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Receive EFIKCOIN</h1>
      <p>Share this address to receive EFIKCOIN and BNB on BNB Smart Chain.</p>
      <div className="address-box">{wallet.address}</div>
      <p className="info">(QR code can be added here later)</p>
      <button onClick={onBack} className="btn btn-secondary">
        Back
      </button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [wallet, setWallet] = useState(null);

  React.useEffect(() => {
    const stored = localStorage.getItem("efikcoin_wallet");
    if (stored) {
      const data = JSON.parse(stored);
      const w = new ethers.Wallet(ethers.Wallet.fromMnemonic(data.mnemonic).privateKey);
      setWallet(w);
      setScreen("dashboard");
    }
  }, []);

  const handleCreateWallet = () => setScreen("create");
  const handleImportWallet = () => setScreen("import");
  const handleWalletCreated = () => {
    const stored = JSON.parse(localStorage.getItem("efikcoin_wallet"));
    const w = ethers.Wallet.fromMnemonic(stored.mnemonic);
    setWallet(w);
    setScreen("dashboard");
  };
  const handleWalletImported = () => {
    const stored = JSON.parse(localStorage.getItem("efikcoin_wallet"));
    const w = ethers.Wallet.fromMnemonic(stored.mnemonic);
    setWallet(w);
    setScreen("dashboard");
  };
  const handleLogout = () => {
    localStorage.removeItem("efikcoin_wallet");
    setWallet(null);
    setScreen("onboarding");
  };

  return (
    <div className="App">
      {screen === "onboarding" && (
        <OnboardingScreen
          onCreateWallet={handleCreateWallet}
          onImportWallet={handleImportWallet}
        />
      )}
      {screen === "create" && <CreateWalletScreen onWalletCreated={handleWalletCreated} />}
      {screen === "import" && <ImportWalletScreen onWalletImported={handleWalletImported} />}
      {screen === "dashboard" && (
        <DashboardScreen
          wallet={wallet}
          onSend={() => setScreen("send")}
          onReceive={() => setScreen("receive")}
          onLogout={handleLogout}
        />
      )}
      {screen === "send" && <SendScreen wallet={wallet} onBack={() => setScreen("dashboard")} />}
      {screen === "receive" && <ReceiveScreen wallet={wallet} onBack={() => setScreen("dashboard")} />}
    </div>
  );
}
