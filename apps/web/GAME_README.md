# Space Shooter - NFT-Gated Game

A fun space shooter game built with Next.js, Canvas API, and Celo blockchain. Players must mint an NFT to gain access to the game!

## 🎮 Features

- **NFT-Gated Access**: Players need to mint a Game Access Pass NFT to play
- **Classic Space Shooter Gameplay**: 
  - Smooth WASD/Arrow key controls
  - Progressive difficulty system
  - Enemy ships with varying health
  - Score tracking and high scores
  - Particle effects and explosions
- **Web3 Integration**:
  - Built on Celo blockchain
  - RainbowKit wallet connection
  - ERC721 NFT contract for access control
  - On-chain verification

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Celo wallet (MetaMask, Valora, etc.)
- Some CELO tokens for minting

### Installation

1. **Clone and install dependencies:**
```bash
cd apps/web
pnpm install
```

2. **Set up environment variables:**
```bash
cp .env.template .env.local
```

Edit `.env.local` and add:
- Your WalletConnect Project ID
- The deployed Game NFT contract address

### Deploy the Smart Contract

1. **Navigate to contracts directory:**
```bash
cd apps/contracts
```

2. **Install OpenZeppelin contracts:**
```bash
pnpm add @openzeppelin/contracts
```

3. **Compile the contract:**
```bash
npx hardhat compile
```

4. **Deploy to Celo Alfajores testnet:**
```bash
npx hardhat ignition deploy ./ignition/modules/GameAccessNFT.ts --network alfajores
```

5. **Copy the deployed contract address** and update `NEXT_PUBLIC_GAME_NFT_ADDRESS` in your `.env.local`

### Run the Application

```bash
cd apps/web
pnpm dev
```

Visit `http://localhost:3000` and navigate to the Game page!

## 🎯 How to Play

1. **Connect your wallet** using the button in the navbar
2. **Navigate to the Game page**
3. **Mint your Access Pass NFT** (costs 0.01 CELO by default)
4. **Start playing!**
   - Use **WASD** or **Arrow Keys** to move your ship
   - Press **SPACE** to shoot
   - Destroy enemies to score points
   - Survive as long as possible and reach new levels!

## 📝 Smart Contract Details

The `GameAccessNFT.sol` contract includes:

- **ERC721 Token**: Each NFT grants lifetime game access
- **Minting Function**: Payable function to mint access passes
- **Access Control**: On-chain verification of ownership
- **Owner Functions**: Update mint price, toggle minting, withdraw funds
- **Supply Limits**: Configurable max supply

### Contract Functions

```solidity
// Mint a game access NFT
function mint() external payable

// Check if an address has access
function checkAccess(address user) external view returns (bool)

// Get current mint price
function mintPrice() external view returns (uint256)

// Get total minted
function totalMinted() external view returns (uint256)
```

## 🎨 Game Mechanics

### Scoring System
- **10 points** per enemy destroyed
- Points multiply by current level
- Level up every 200 points

### Difficulty Progression
- Enemies spawn faster at higher levels
- Enemy speed increases with levels
- Stronger enemies appear (require multiple hits)
- Health bars show enemy strength

### Visual Features
- Animated starfield background
- Particle explosion effects
- Glowing projectiles
- Health bars for tough enemies
- Smooth sprite rendering

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Blockchain**: Celo, Hardhat
- **Web3**: Wagmi, Viem, RainbowKit
- **Smart Contracts**: Solidity, OpenZeppelin
- **Canvas API**: For game rendering

## 📦 Project Structure

```
apps/
  contracts/
    contracts/
      GameAccessNFT.sol       # NFT access control contract
    ignition/
      modules/
        GameAccessNFT.ts      # Deployment script
  web/
    src/
      app/
        game/
          page.tsx            # Game page with access control
      components/
        space-shooter-game.tsx  # Main game component
        mint-game-nft.tsx       # NFT minting UI
        navbar.tsx              # Navigation with game link
```

## 🔐 Security Considerations

- NFT ownership is verified on-chain
- Access checks happen client-side and can be enhanced with backend verification
- Smart contract uses OpenZeppelin's audited contracts
- Excess payment is automatically refunded
- Owner-only functions for contract management

## 🎨 Customization

### Adjust Game Difficulty
Edit `space-shooter-game.tsx`:
```typescript
const SHOT_COOLDOWN = 250  // Lower = faster shooting
const ENEMY_SPAWN_RATE = 1000  // Lower = more enemies
```

### Change NFT Price
Edit `GameAccessNFT.ts` deployment module:
```typescript
const mintPrice = parseEther("0.01")  // Price in CELO
```

### Modify Max Supply
```typescript
const maxSupply = 1000n  // Maximum NFTs
```

## 🐛 Troubleshooting

**Game not loading?**
- Make sure you've deployed the contract and updated the address in `.env.local`
- Check that your wallet is connected to the correct network

**Can't mint NFT?**
- Ensure you have enough CELO for the mint price + gas
- Check that minting is enabled on the contract
- Verify you don't already own an access NFT

**Controls not working?**
- Click on the game canvas to focus
- Make sure the game state is "playing"

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new enemy types
- Implement power-ups
- Add sound effects
- Create leaderboards
- Add multiplayer features

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- Built for the Celo ecosystem
- Inspired by classic arcade space shooters
- Uses RainbowKit for seamless wallet integration

---

**Have fun playing! 🚀✨**
