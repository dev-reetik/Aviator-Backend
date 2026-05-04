# Aviator Backend

A real-time multiplayer crash game backend built with Node.js, Express, MongoDB, and Socket.IO.

## 📋 Project Overview

Aviator Backend is a complete gaming server for the Aviator crash game, featuring:
- User authentication with JWT
- Real-time game sessions via WebSocket
- Wallet management system
- Betting and payout system
- Crash game engine simulation
- MongoDB database integration

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB (Mongoose 9.6.1)
- **Real-time**: Socket.IO 4.8.3
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Security**: bcryptjs 3.0.3, Helmet 7.1.0
- **Logging**: Morgan 1.10.0
- **CORS**: cors 2.8.6
- **Development**: nodemon

## 📦 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Aviator-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/aviator
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
Aviator-Backend/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   ├── Auth.Controller.js # Authentication logic
│   └── Wallet.Controller.js # Wallet management
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.Model.js      # User schema
│   ├── Bet.Model.js       # Bet records schema
│   └── Round.Model.js     # Game round schema
├── routes/
│   ├── Auth.Routes.js     # Auth endpoints
│   └── Wallet.Routes.js   # Wallet endpoints
├── services/
│   ├── Auth.Service.js    # Auth business logic
│   ├── Game.Service.js    # Game logic
│   ├── Wallet.Service.js  # Wallet operations
│   └── Crash.Service.js   # Crash calculation
├── sockets/
│   └── SocketManager.js   # WebSocket event handlers
├── Game.Engine.js         # Main game engine
├── server.js              # Express server setup
├── package.json           # Project dependencies
└── .env                   # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Wallet
- `GET /api/wallet/balance` - Get user balance
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/withdraw` - Withdraw funds

## 🎮 WebSocket Events

Real-time game events via Socket.IO:
- `game:start` - Start new game round
- `game:crash` - Game crash occurred
- `game:join` - User joins game
- `game:place-bet` - User places bet
- `game:end` - Game round ends

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | - |
| `JWT_SECRET` | Secret key for JWT signing | - |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |

## 🧪 Testing

Run tests:
```bash
npm test
```

