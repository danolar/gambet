# 🏈 GamBet - AI-Powered Sports Predictions

A decentralized sports betting platform that leverages artificial intelligence to provide intelligent predictions and betting opportunities on various sports events.

## 🚀 Features

- **AI-Powered Predictions**: Advanced machine learning algorithms analyze sports data to generate accurate predictions
- **Decentralized Betting**: Built on blockchain technology for transparent and secure betting
- **Multi-Sport Support**: Covering football, basketball, baseball, and other major sports
- **Real-time Updates**: Live odds and prediction updates as games progress
- **User-Friendly Interface**: Modern, responsive web application with intuitive betting experience
- **Wallet Integration**: Seamless connection with popular cryptocurrency wallets
- **Prediction NFTs**: Unique digital assets representing successful predictions

## 🏗️ Architecture

The project consists of three main components:

### 📱 Frontend (`gambet-app/`)
- **React + TypeScript** application with modern UI/UX
- **Tailwind CSS** for responsive design
- **Vite** for fast development and building
- **AI Agent Chat** for interactive prediction assistance
- **Wallet Integration** for blockchain transactions

### 🔧 Backend API (`gambet-api/`)
- **Node.js** server with Express framework
- **PostgreSQL** database for data persistence
- **Vision Management** system for predictions and bets
- **Image Processing** with base64 support
- **RESTful API** endpoints for all operations

### ⛓️ Smart Contracts (`gambet-contracts/`)
- **Solidity** smart contracts for decentralized betting
- **Foundry** framework for development and testing
- **OpenZeppelin** for secure contract implementations
- **Prediction NFTs** for unique prediction tokens
- **Sports Betting** logic for automated payouts

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, PostgreSQL
- **Blockchain**: Solidity, Foundry, OpenZeppelin
- **AI/ML**: OpenAI integration for intelligent predictions
- **Deployment**: Vercel-ready configuration
- **Development**: ESLint, Prettier, TypeScript strict mode

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Foundry (for smart contracts)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/danolar/gambet.git
   cd gambet
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd gambet-app
   npm install
   
   # Backend
   cd ../gambet-api
   npm install
   
   # Smart Contracts
   cd ../gambet-contracts
   forge install
   ```

3. **Environment Setup**
   ```bash
   # Backend
   cd gambet-api
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Frontend
   cd ../gambet-app
   cp env.example .env
   # Edit .env with your API endpoints
   ```

4. **Database Setup**
   ```bash
   cd gambet-api
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # Backend (in gambet-api directory)
   npm run dev
   
   # Frontend (in gambet-app directory)
   npm run dev
   
   # Smart Contracts (in gambet-contracts directory)
   forge build
   ```

## 📱 Usage

1. **Connect Wallet**: Use the wallet button to connect your cryptocurrency wallet
2. **Browse Predictions**: View AI-generated predictions for upcoming sports events
3. **Place Bets**: Select your preferred predictions and place bets using cryptocurrency
4. **Track Performance**: Monitor your betting history and prediction accuracy
5. **AI Assistance**: Chat with the AI agent for betting advice and analysis

## 🔒 Security Features

- **Smart Contract Audits**: OpenZeppelin audited contracts
- **Input Validation**: Comprehensive validation on all user inputs
- **Environment Security**: Secure handling of API keys and database credentials
- **Wallet Security**: Non-custodial wallet integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🎯 Roadmap

- [ ] **Phase 1**: Core betting functionality ✅
- [ ] **Phase 2**: Advanced AI predictions 🔄
- [ ] **Phase 3**: Mobile application 📱
- [ ] **Phase 4**: Multi-chain support ⛓️
- [ ] **Phase 5**: Social features and leaderboards 🏆

---


*GamBet - Where AI & Blockchain meets sports betting*
