# EFIKCOIN Wallet — Project Rename Guide

This document explains how to safely rename the EFIKCOIN Wallet project, update all branding, and ensure the application continues working after the rename.

---

## 1. Project Name
Update the main project name everywhere:

- App name: **EFIKCOIN Wallet**
- Package name (Android): `com.efikcoin.wallet`
- Bundle identifier (iOS): `com.efikcoin.wallet`
- Display name: **EFIKCOIN Wallet**
- Repository name: `efikcoin-wallet`

---

## 2. Branding & Assets
Replace or confirm the following assets:

### Logo  
Use the official EFIKCOIN logo:  
`https://ipfs.io/ipfs/bafybeihrzyodihyp5met2hs32ppj37qlowuxarvs2lnlrgujgrlwxc7fwe`

### Colors  
Recommended palette:
- Primary: `#2563eb` (blue)
- Secondary: `#050816` (dark cosmic)
- Accent: `#22c55e` (green)
- Text: `#ffffff` (white)

### App Icons  
Update:
- `android/app/src/main/res/mipmap-*`
- `ios/App/App/Assets.xcassets/AppIcon.appiconset`

---

## 3. Contract Information
Ensure EFIKCOIN contract details are correct:

- **Token Name:** EFIKCOIN  
- **Symbol:** EFC  
- **Network:** BNB Smart Chain  
- **Contract Address:** `0x677Ce9CBa67f7484ea951a12897CE780cFd8fED1`

Update these values in:
- `constants.js`
- `config.json`
- Any wallet integration files

---

## 4. App Text & Labels
Search and replace any old names:

Replace:
- “MyWallet”
- “CryptoWallet”
- “SampleWallet”

With:
- **EFIKCOIN Wallet**

Check:
- Splash screen text  
- Dashboard labels  
- Settings page  
- About page  

---

## 5. Folder Structure
Rename folders for clarity:
