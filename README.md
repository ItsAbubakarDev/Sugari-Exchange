# 💹 Sugari Exchange

**Sugari Exchange** is a modern web-based cryptocurrency **trading simulation platform** where users can:

- 📈 View **real-time crypto charts** using the powerful TradingView widget.
- 🧪 Execute **simulated buy/sell trades** without using real funds.
- 💼 Manage a **personalized virtual portfolio** with persistent backend storage.
- 🔐 Sign up and log in securely using **JWT-based authentication**.

This platform is ideal for aspiring traders looking to practice and develop strategies in a safe and interactive environment.

---

## 🚀 Features

- **📊 Live Charts**: Visualize real-time market data for various coins via TradingView integration.
- **🛒 Trade Simulator**: Simulate trades to test strategies without financial risk.
- **📁 Portfolio Tracker**: View and manage your virtual holdings in one place.
- **🔐 Secure Auth**: Register/login using **JWT tokens** with backend validation.
- **🧑‍💻 Responsive UI**: Seamless experience across desktop and mobile devices.

---

## 🛠️ Technologies Used

### 🔷 Frontend

- React.js
- React Router DOM
- Axios
- Lucide React (for icons)
- CSS

### 🔶 Backend

- Node.js & Express.js
- MongoDB (via Mongoose)
- JSON Web Tokens (JWT)
- Express Async Handler

### 🌐 Integrations

- **TradingView Widget** – for live, interactive market charts
- **CoinGecko API** – for real-time cryptocurrency data

---

## 📦 Installation

To run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/ItsAbubakarDev/Sugari-Exchange.git
cd Sugari-Exchange
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm start
```

---

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm start
```

---

### 4. Launch the App

Open your browser at:

```
http://localhost:3000
```

---

## 🧭 Usage Guide

### 🔐 Authentication

- Register for a new account or log in with existing credentials to unlock trading and portfolio features.

### 📈 Trading

- Navigate to the **Trade** page.
- Use the **TradingView widget** to monitor real-time price movements.
- Enter the coin name, price, and quantity to simulate **Buy** or **Sell** actions.

### 💼 Portfolio

- Head to the **Portfolio** page.
- View your current virtual holdings and simulate portfolio changes.
- Track historical activity based on simulated trades.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch:  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes.
4. Commit and push:  
   ```bash
   git commit -m "Describe your feature"
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request to the main repo with a clear description.

---

## 📬 Feedback

Have suggestions or found a bug?  
Feel free to open an [Issue](https://github.com/ItsAbubakarDev/Sugari-Exchange/issues) or start a discussion.

---

## 📎 Note

This project currently does **not** have a license. Usage and distribution are subject to the author's discretion.

---

> Built with 💻 by [ItsAbubakarDev](https://github.com/ItsAbubakarDev)
