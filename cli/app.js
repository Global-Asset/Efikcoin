// App.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ethers } from "ethers";

const Stack = createNativeStackNavigator();

// BNB Smart Chain + EFIKCOIN
const RPC_URL = "https://bsc-dataseed.binance.org/";
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const EFIKCOIN_ADDRESS = "0x677Ce9CBa67f7484ea951a12897CE780cFd8fED1";
const EFIKCOIN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
];

// Simple global store (for demo)
const AppContext = React.createContext(null);

function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Onboarding");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050816", justifyContent: "center", alignItems: "center" }}>
      <Image
        source={{ uri: "https://ipfs.io/ipfs/bafybeihrzyodihyp5met2hs32ppj37qlowuxarvs2lnlrgujgrlwxc7fwe" }}
        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20 }}
      />
      <Text style={{ color: "white", fontSize: 22, fontWeight: "bold", textAlign: "center" }}>
        EFIKCOIN Wallet
      </Text>
      <Text style={{ color: "#9ca3af", marginTop: 10, textAlign: "center" }}>
        Your Keys. Your Planet. Your Future.
      </Text>
    </SafeAreaView>
  );
}

function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050816", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Welcome to EFIKCOIN Wallet
      </Text>
      <Text style={{ color: "#9ca3af", marginBottom: 30 }}>
        Self‑custodian wallet for EFIKCOIN (EFC) on BNB Smart Chain. No organisation, no middleman—just you.
      </Text>

      <TouchableOpacity
        style={{ backgroundColor: "#2563eb", padding: 15, borderRadius: 10, marginBottom: 15 }}
        onPress={() => navigation.navigate("CreateWallet")}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Create New Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: "#4b5563", padding: 15, borderRadius: 10 }}
        onPress={() => navigation.navigate("ImportWallet")}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Import Existing Wallet</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 40 }}>
        <Text style={{ color: "#9ca3af", fontSize: 12 }}>
          EFIKCOIN is a digital planet ecosystem token built on BNB Smart Chain.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function CreateWalletScreen({ navigation }) {
  const { setWallet } = React.useContext(AppContext);
  const [mnemonic, setMnemonic] = useState("");

  const handleCreate = () => {
    const newWallet = ethers.Wallet.createRandom();
    setWallet(newWallet);
    setMnemonic(newWallet.mnemonic.phrase);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050816", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Create New Wallet
      </Text>
      <Text style={{ color: "#9ca3af", marginBottom: 20 }}>
        This will generate a new EFIKCOIN wallet with a unique seed phrase. Write it down and keep it safe.
      </Text>

      <Button title="Generate Wallet" onPress={handleCreate} />

      {mnemonic ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "#f97316", fontWeight: "bold", marginBottom: 10 }}>Your Seed Phrase:</Text>
          <Text style={{ color: "white", marginBottom: 20 }}>{mnemonic}</Text>
          <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 20 }}>
            Never share this phrase. EFIKCOIN Wallet cannot recover it if lost.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: "#22c55e", padding: 12, borderRadius: 10 }}
            onPress={() => navigation.replace("Dashboard")}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Continue to Dashboard</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function ImportWalletScreen({ navigation }) {
  const { setWallet } = React.useContext(AppContext);
  const [mnemonic, setMnemonic] = useState("");

  const handleImport = () => {
    try {
      const wallet = ethers.Wallet.fromMnemonic(mnemonic.trim());
      setWallet(wallet);
      Alert.alert("Success", "Wallet imported successfully.");
      navigation.replace("Dashboard");
    } catch (e) {
      Alert.alert("Error", "Invalid seed phrase.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050816", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Import Wallet
      </Text>
      <Text style={{ color: "#9ca3af", marginBottom: 20 }}>
        Paste your 12/24‑word seed phrase to restore your EFIKCOIN wallet.
      </Text>

      <TextInput
        style={{
          backgroundColor: "#111827",
          color: "white",
          padding: 10,
          borderRadius: 8,
          height: 120,
          textAlignVertical: "top",
          marginBottom: 20,
        }}
        multiline
        placeholder="Seed phrase..."
        placeholderTextColor="#6b7280"
        value={mnemonic}
        onChangeText={setMnemonic}
      />

      <TouchableOpacity
        style={{ backgroundColor: "#2563eb", padding: 12, borderRadius: 10 }}
        onPress={handleImport}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Restore Wallet</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function DashboardScreen({ navigation }) {
  const { wallet } = React.useContext(AppContext);
  const [efcBalance, setEfcBalance] = useState("0");
  const [bnbBalance, setBnbBalance] = useState("0");

  const loadBalances = async () => {
    if (!wallet) return;
    try {
      const efcContract = new ethers.Contract(EFIKCOIN_ADDRESS, EFIKCOIN_ABI, provider);
      const bal = await efcContract.balanceOf(wallet.address);
      setEfcBalance(ethers.utils.formatUnits(bal, 18));

      const nativeBal = await provider.getBalance(wallet.address);
      setBnbBalance(ethers.utils.formatEther(nativeBal));
    } catch (e) {
      Alert.alert("Error", "Failed to load balances.");
    }
  };

  useEffect(() => {
    loadBalances();
  }, [wallet]);

  if (!wallet) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#050816", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>No wallet loaded. Go back and create/import one.</Text>
      </SafeAreaView>
    );
  }

  const shortAddress = wallet.address.slice(0, 6) + "..." + wallet.address.slice(-4);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050816", padding: 20 }}>
      <ScrollView>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
          EFIKCOIN Dashboard
        </Text>

        <Text style={{ color: "#9ca3af", marginBottom: 10 }}>Address: {shortAddress}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
          <View style={{ backgroundColor: "#111827", padding: 15, borderRadius: 12, flex: 1, marginRight: 8 }}>
            <Text style={{ color: "#9ca3af", marginBottom: 5 }}>EFIKCOIN (EFC)</Text>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{efcBalance}</Text>
          </View>
          <View style={{ backgroundColor: "#111827", padding: 15, borderRadius: 12, flex: 1, marginLeft: 8 }}>
            <Text style={{ color: "#9ca3af", marginBottom: 5 }}>BNB</Text>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{bnbBalance}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
          <TouchableOpacity
            style={{ backgroundColor: "#2563eb", padding: 12, borderRadius: 10, flex: 1, marginRight: 8 }}
            onPress={() => navigation.navigate("Send")}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "#22c55e", padding: 12, borderRadius: 10, flex: 1, marginLeft: 8 }}
            onPress={() => navigation.navigate("Receive")}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Receive</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ backgroundColor: "#4b5563", padding: 12, borderRadius: 10, marginBottom: 10 }}
          onPress={loadBalances}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Refresh Balances</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: "#111827", padding: 12, borderRadius: 10, marginBottom: 10 }}
          onPress={() => navigation.navigate("History")}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Transaction History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: "#111827", padding: 12, borderRadius: 10 }}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SendScreen() {
  const { wallet } = React.useContext(AppContext);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleSend = async () => {
    if (!wallet) {
      Alert.alert("Error", "No wallet loaded.");
      return;
    }
    try {
      const signer = wallet.connect(provider);
      const contract = new ethers.Contract(EFIKCOIN_ADDRESS, EFIKCOIN_ABI, signer);
      const tx = await contract.transfer(recipient, ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      Alert.alert("Success", "Transaction sent: " + tx.hash);
    } catch (e) {
      Alert.alert("Error", "Failed to send EFIKCOIN.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050816", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Send EFIKCOIN</Text>

      <TextInput
        style={{
          backgroundColor: "#111827",
          color: "white",
          padding: 10,
          borderRadius: 8,
          marginBottom: 15,
        }}
        placeholder="Recipient address"
        placeholderTextColor="#6b7280"
        value={recipient}
        onChangeText={setRecipient}
      />

      <TextInput
        style={{
          backgroundColor: "#111827",
          color: "white",
          padding: 10,
          borderRadius: 8,
          marginBottom: 15,
        }}
        placeholder="Amount (EFC)"
        placeholderTextColor="#6b7280"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity
        style={{ backgroundColor: "#2563eb", padding: 12, borderRadius: 10 }}
        onPress={handleSend}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Send EFIKCOIN</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function ReceiveScreen() {
  const { wallet } = React.useContext(AppContext);

  if (!wallet) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#050816", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>No wallet loaded.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050816", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Receive EFIKCOIN</Text>
      <Text style={{ color: "#9ca3af", marginBottom: 10 }}>
        Share this address to receive EFIKCOIN and BNB on BNB Smart Chain.
      </Text>
      <Text style={{ color: "white", marginBottom: 20 }}>{wallet.address}</Text>
      {/* QR code component can be added here (e.g. react-native-qrcode-svg) */}
      <Text style={{ color: "#6b7280", fontSize: 12 }}>
        (Developer note: add QR code for wallet.address here.)
      </Text>
    </SafeAreaView>
  );
}

function HistoryScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050816", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Transaction History
      </Text>
      <Text style={{ color: "#9ca3af" }}>
        For now, this is a placeholder. A developer can integrate BscScan API or direct RPC logs to show
        sent/received EFIKCOIN and BNB transactions.
      </Text>
    </SafeAreaView>
  );
}

function SettingsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050816", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Settings</Text>
      <Text style={{ color: "#9ca3af", marginBottom: 10 }}>
        - Backup Seed Phrase (show again from secure storage){"\n"}
        - Enable PIN / Biometrics{"\n"}
        - Network settings (RPC URL){"\n"}
        - Theme (Light/Dark){"\n"}
        - About EFIKCOIN
      </Text>
      <Text style={{ color: "#9ca3af", marginTop: 20 }}>
        EFIKCOIN: Digital planet ecosystem token on BNB Smart Chain. Contract: {EFIKCOIN_ADDRESS}
      </Text>
    </SafeAreaView>
  );
}

export default function App() {
  const [wallet, setWallet] = useState(null);

  return (
    <AppContext.Provider value={{ wallet, setWallet }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
          <Stack.Screen name="ImportWallet" component={ImportWalletScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Send" component={SendScreen} />
          <Stack.Screen name="Receive" component={ReceiveScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
