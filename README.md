# Celo Wallet with QR Code Support

A simple, user-friendly EVM-compatible wallet built for the Celo blockchain on MiniPay, with comprehensive QR code capabilities.

## Features

### 🔐 Wallet Management
- **Connect Wallet**: Connect your MetaMask or other Web3 wallet via RainbowKit
- **View Balance**: Display your CELO token balance in real-time
- **Copy Address**: Quick-copy your wallet address to clipboard
- **Multi-Chain Support**: Works with Celo Mainnet, Alfajores (testnet), and Sepolia (testnet)

### 📱 QR Code Capabilities

#### Receive Funds
- **Generate QR Code**: Instantly create a QR code for your wallet address
- **Download QR Code**: Save your wallet QR code as a PNG image
- **Share Address**: Easily share your address for receiving payments

#### Send Funds
- **QR Scanner**: Scan recipient wallet QR codes using your device camera
- **Manual Entry**: Type addresses manually or use QR scanning
- **Transaction Confirmation**: Real-time transaction status updates
- **Success Feedback**: Clear confirmation when transactions complete

### 💸 Send Transactions
- Enter recipient address (manually or via QR scan)
- Specify amount in CELO
- Real-time transaction status
- Transaction hash display upon success

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- A Web3 wallet (MetaMask recommended)

### Installation

The required dependencies are already installed:
- `qrcode.react` - QR code generation
- `html5-qrcode` - QR code scanning
- `wagmi` & `viem` - Ethereum interactions
- `@rainbow-me/rainbowkit` - Wallet connection

### Running the Application

1. Start the development server:
```bash
cd apps/web
pnpm dev
```

2. Open your browser to `http://localhost:3002` (or the port shown in terminal)

3. Connect your wallet using the "Connect Wallet" button in the navbar

### Configuration

Set your WalletConnect Project ID in `.env.local`:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get a free Project ID at [WalletConnect Cloud](https://cloud.walletconnect.com/)

## Usage Guide

### Receiving Tokens

1. Click the **"Receive"** button in the wallet dashboard
2. Your wallet address QR code will be displayed
3. Share the QR code or copy the address
4. Optionally download the QR code for offline sharing

### Sending Tokens

1. Click the **"Send"** button in the wallet dashboard
2. Enter or scan the recipient's address:
   - Click the QR icon to scan a QR code
   - Or paste/type the address manually
3. Enter the amount of CELO to send
4. Click **"Send Transaction"**
5. Confirm the transaction in your wallet
6. Wait for blockchain confirmation

### QR Code Scanning

To scan a QR code:
1. Click the QR icon button
2. Allow camera access when prompted
3. Point your camera at the QR code
4. The address will be automatically filled when detected

## Components

### WalletDashboard
Main wallet interface displaying balance, address, and action buttons.

### ReceiveQRCode
Generates and displays a QR code for receiving payments. Includes download functionality.

### QRScanner
Camera-based QR code scanner for reading wallet addresses from QR codes.

### SendTransaction
Transaction form with QR scanning support, validation, and status tracking.

## Tech Stack

- **Next.js 14** - React framework
- **Wagmi v2** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI
- **TailwindCSS** - Styling
- **Radix UI** - UI components
- **qrcode.react** - QR code generation
- **html5-qrcode** - QR code scanning

## Network Support

- Celo Mainnet (Chain ID: 42220)
- Celo Alfajores Testnet (Chain ID: 44787)
- Celo Sepolia Testnet (Chain ID: 11142220)

## Security Notes

- Never share your private keys or seed phrase
- Always verify recipient addresses before sending
- Start with small test transactions on testnets
- Double-check transaction details before confirming

## Browser Compatibility

- Chrome/Edge (recommended for camera access)
- Firefox
- Safari (iOS/macOS)
- Brave

**Note**: Camera access for QR scanning requires HTTPS in production.

## Troubleshooting

### Camera Not Working
- Ensure you've granted camera permissions
- Use HTTPS (required for camera access in production)
- Check if another app is using the camera

### Transaction Failing
- Ensure you have enough CELO for the transaction + gas fees
- Check you're on the correct network
- Verify the recipient address is valid

### Wallet Not Connecting
- Refresh the page
- Check your wallet extension is unlocked
- Try disconnecting and reconnecting
- Ensure you're on a supported network

## License

MIT
