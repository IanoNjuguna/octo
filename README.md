# Octo 🐙

A Web3 space shooter game with integrated MiniPay wallet - play, send, and receive CELO tokens seamlessly.

## 🎮 Game Features

- **Balance-Gated Access**: Hold at least 0.2 CELO to unlock and play the game
- **Fibonacci Level Progression**: 10 levels following the Fibonacci sequence (100, 200, 300, 500, 800, 1300, 2100, 3400, 5500, 8900 points)
- **Lives System**: Start with 3 lives, collect heart pickups to gain more (max 5 lives)
- **Invincibility Mechanic**: 2-second invincibility period after taking damage (player flashes)
- **Dynamic Difficulty**: Enemy spawn rates and movement speed increase with each level
- **Life Pickups**: Heart drops with scaling rates (2%/5%/8% based on level tier)
- **High Score Tracking**: Personal best saved locally - challenge yourself!
- **Dark Mode**: Toggle between light mode and ocean-themed dark mode with animated waves
- **WASD/Arrow Keys**: Smooth keyboard controls for movement
- **Space to Shoot**: Unlimited bullets - keep firing!
- **Dynamic Tips**: Rotating game tips every 60 seconds with Fibonacci facts

## 🔐 Wallet Features

- **Connect Wallet**: RainbowKit integration (MetaMask, Coinbase Wallet, WalletConnect)
- **Real-Time Balance**: View your CELO balance with automatic updates
- **QR Code Generation**: Generate QR codes for receiving funds
- **QR Code Scanner**: Scan recipient addresses with your camera
- **Send Transactions**: Send CELO tokens with transaction status tracking
- **Copy Address**: One-click address copying to clipboard
- **Multi-Chain Support**: Celo Mainnet, Alfajores (testnet), and Sepolia (testnet)

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- pnpm (recommended), npm, or yarn
- A Web3 wallet browser extension (MetaMask recommended)
- At least 0.2 CELO to play the game

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/IanoNjuguna/octo.git
cd octo
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start the development server**
```bash
pnpm dev
```

4. **Open localhost in your browser**
Navigate to `http://localhost:<port shown in terminal>`

## 🎯 How to Play

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the top navigation bar
   - Select your preferred wallet (MetaMask, Coinbase, etc.)
   - Approve the connection

2. **Get CELO Tokens**
   - You need at least 0.2 CELO to play
   - If you don't have enough, visit the Wallet page to get your address/QR code
   - Get testnet CELO from [Celo Faucet](https://faucet.celo.org/) (for Alfajores testnet)

3. **Start Playing**
   - Navigate to the home page
   - Once you have 0.2+ CELO, the game will unlock automatically
   - Click "START GAME" to begin
   - Use **WASD** or **Arrow Keys** to move your ship
   - Press **Space** to shoot enemies
   - Press **P** or click Pause button to pause

4. **Game Mechanics**
   - Destroy enemies to earn points
   - Collect heart pickups to gain extra lives
   - Avoid enemy collisions (you'll lose a life)
   - Survive as long as possible and reach higher levels
   - Game ends when you run out of lives

## 🏗️ Project Structure

```
octo/
├── apps/
│   ├── web/                    # Next.js application
│   │   ├── src/
│   │   │   ├── app/            # App router pages
│   │   │   │   ├── page.tsx    # Home/Game page
│   │   │   │   ├── game/       # Game page (redirects to home)
│   │   │   │   └── wallet/     # Wallet management page
│   │   │   ├── components/
│   │   │   │   ├── space-shooter-game.tsx     # Main game component
│   │   │   │   ├── check-celo-balance.tsx     # Balance gate component
│   │   │   │   ├── wallet-dashboard.tsx       # Wallet UI
│   │   │   │   ├── send-transaction.tsx       # Send CELO
│   │   │   │   ├── qr-scanner.tsx             # QR code scanning
│   │   │   │   ├── receive-qr-code.tsx        # QR code generation
│   │   │   │   ├── receive-dropdown.tsx       # Quick receive dropdown
│   │   │   │   ├── theme-provider.tsx         # Dark mode
│   │   │   │   ├── theme-toggle.tsx           # Theme switcher
│   │   │   │   └── ui/                        # shadcn/ui components
│   │   │   └── lib/
│   │   └── package.json
│   └── contracts/              # Hardhat setup (no active contracts)
└── package.json                # Workspace root
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Blockchain**: Celo (EVM-compatible)
- **Web3 Libraries**: 
  - Wagmi v2 (React hooks for Ethereum)
  - Viem (TypeScript Ethereum library)
  - RainbowKit (Wallet connection UI)
- **QR Codes**:
  - qrcode.react (generation)
  - html5-qrcode (scanning)
- **Game**: HTML5 Canvas with requestAnimationFrame
- **Monorepo**: Turborepo with pnpm workspaces

## 🌐 Supported Networks

- **Celo Mainnet** (Chain ID: 42220)
- **Celo Alfajores Testnet** (Chain ID: 44787) - Recommended for testing
- **Celo Sepolia Testnet** (Chain ID: 11142220)

## 📱 Wallet Usage

### Receiving CELO

1. Navigate to the Wallet page
2. Click "Receive" button
3. Share your QR code or copy your address
4. Optional: Download the QR code as PNG

### Sending CELO

1. Navigate to the Wallet page
2. Click "Send" button
3. Enter recipient address (or click QR icon to scan)
4. Enter amount to send
5. Click "Send Transaction"
6. Confirm in your wallet
7. Wait for transaction confirmation

## 🎨 Themes

Octo supports light and dark modes:
- **Light Mode**: Clean, modern interface
- **Dark Mode**: Ocean-themed with animated wave background in game

Toggle using the sun/moon icon in the navigation bar.

## 🐛 Troubleshooting

### Game Won't Start
- **Issue**: "Can't Play Yet - Need More CELO"
- **Solution**: You need at least 0.2 CELO. Visit the Wallet page to get your address and fund it.

### Balance Not Updating
- **Solution**: Disconnect and reconnect your wallet, or refresh the page.

### Camera Not Working (QR Scanner)
- Ensure you've granted camera permissions in your browser
- HTTPS is required for camera access (localhost works for development)
- Check if another application is using the camera

### Transaction Failing
- Ensure you have enough CELO for the transaction + gas fees
- Verify you're on the correct network (check wallet network dropdown)
- Check the recipient address is a valid Ethereum address

### Wallet Connection Issues
- Refresh the page
- Make sure your wallet extension is unlocked
- Try disconnecting and reconnecting
- Switch to a supported network (Celo, Alfajores, or Sepolia)

## 🔒 Security Notes

- Never share your private keys or seed phrase with anyone
- Always verify recipient addresses before sending transactions
- Start with small test amounts on testnets (Alfajores)
- Double-check transaction details before confirming
- The game only checks your balance - your CELO stays in your wallet

## 🌟 Game Tips

- **Invincibility**: After taking damage, you flash for 2 seconds - use this time to reposition
- **Fibonacci Progression**: Score thresholds follow the Fibonacci sequence
- **Enemy Health**: Some enemies require multiple hits - look for health bars
- **Unlimited Ammo**: Don't be shy - keep shooting!
- **Dark Mode**: Try the ocean wave background for an immersive experience

## 📄 License

MIT

## 🙏 Acknowledgments

- Built on the [Celo](https://celo.org/) blockchain
- Wallet infrastructure by [RainbowKit](https://www.rainbowkit.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)

---

**Ready to play?** Get some CELO and start your space adventure! 🚀🐙
