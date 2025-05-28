import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import './Trade.css';

const Trade = () => {
  const [selectedCoin, setSelectedCoin] = useState('');
  const [selectedExchange, setSelectedExchange] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [portfolio, setPortfolio] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [balance, setBalance] = useState(10000); // Starting with $10,000
  const [notification, setNotification] = useState(null);

  // Mock cryptocurrency data
  const cryptoData = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 67500.00, change: 2.45 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3850.00, change: -1.20 },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.75, change: 5.80 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 145.30, change: 3.15 },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', price: 18.45, change: -0.85 }
  ];

  const exchanges = ['Binance', 'Coinbase', 'Kraken', 'KuCoin'];

  useEffect(() => {
    if (selectedCoin) {
      const coin = cryptoData.find(c => c.id === selectedCoin);
      if (coin) {
        setPrice(coin.price.toFixed(2));
      }
    }
  }, [selectedCoin]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const executeTrade = () => {
    if (!selectedCoin || !selectedExchange || !amount || !price) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    const tradeAmount = parseFloat(amount);
    const tradePrice = parseFloat(price);
    const totalValue = tradeAmount * tradePrice;

    if (tradeType === 'buy' && totalValue > balance) {
      showNotification('Insufficient balance for this trade', 'error');
      return;
    }

    const coin = cryptoData.find(c => c.id === selectedCoin);
    const existingAsset = portfolio.find(
      p => p.coinId === selectedCoin && p.exchange === selectedExchange
    );

    let newPortfolio = [...portfolio];

    if (tradeType === 'buy') {
      setBalance(prev => prev - totalValue);
      if (existingAsset) {
        const index = newPortfolio.findIndex(
          p => p.coinId === selectedCoin && p.exchange === selectedExchange
        );
        newPortfolio[index].amount += tradeAmount;
        newPortfolio[index].avgPrice = 
          ((newPortfolio[index].avgPrice * (newPortfolio[index].amount - tradeAmount)) + 
           (tradePrice * tradeAmount)) / newPortfolio[index].amount;
      } else {
        newPortfolio.push({
          coinId: selectedCoin,
          coinName: coin.name,
          coinSymbol: coin.symbol,
          exchange: selectedExchange,
          amount: tradeAmount,
          avgPrice: tradePrice,
          currentPrice: tradePrice
        });
      }
    } else { // sell
      if (!existingAsset || existingAsset.amount < tradeAmount) {
        showNotification('Insufficient holdings to sell', 'error');
        return;
      }
      
      setBalance(prev => prev + totalValue);
      const index = newPortfolio.findIndex(
        p => p.coinId === selectedCoin && p.exchange === selectedExchange
      );
      
      if (newPortfolio[index].amount === tradeAmount) {
        newPortfolio.splice(index, 1);
      } else {
        newPortfolio[index].amount -= tradeAmount;
      }
    }

    setPortfolio(newPortfolio);

    const newTrade = {
      id: Date.now(),
      coinId: selectedCoin,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      exchange: selectedExchange,
      action: tradeType,
      amount: tradeAmount,
      price: tradePrice,
      total: totalValue,
      timestamp: new Date().toLocaleString()
    };

    setTradeHistory(prev => [newTrade, ...prev]);
    showNotification(`${tradeType.toUpperCase()} order executed successfully!`);

    // Reset form
    setAmount('');
    setSelectedCoin('');
    setSelectedExchange('');
  };

  return (
    <div className="trade-container">
      {/* Header Section */}
      <div className="trade-header">
        <h1>Cryptocurrency Trading Simulator</h1>
        <p>Practice trading with real market data in a risk-free environment</p>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      {/* Balance Card */}
      <div className="balance-card">
        <DollarSign className="balance-icon" />
        <div>
          <h3>Available Balance</h3>
          <p>${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="main-content">
        {/* Trading Description */}
        <div className="description-section">
          <h2>About Cryptocurrency Trading</h2>
          <div className="description-content">
            <p>
              Cryptocurrency trading involves buying and selling digital assets on various exchanges. 
              This simulator allows you to practice trading strategies without risking real money.
            </p>
            
            <div className="key-concepts">
              <h3>Key Trading Concepts:</h3>
              <ul>
                <li><strong>Buy Orders:</strong> Purchase cryptocurrency at current or specified prices</li>
                <li><strong>Sell Orders:</strong> Sell your holdings when you want to take profits or cut losses</li>
                <li><strong>Portfolio Diversification:</strong> Spread investments across different cryptocurrencies</li>
                <li><strong>Market Analysis:</strong> Study price movements and trends before making decisions</li>
              </ul>
            </div>

            <div className="risk-warning">
              <AlertCircle size={20} />
              <p>
                <strong>Risk Warning:</strong> Cryptocurrency trading involves significant risk. 
                This simulator is for educational purposes only. Real trading can result in substantial losses.
              </p>
            </div>
          </div>
        </div>

        {/* Trading Interface */}
        <div className="trading-section">
          <h2>Trade Simulation</h2>
          
          {/* Market Data */}
          <div className="market-data">
            <h3>Live Market Prices</h3>
            <div className="crypto-list">
              {cryptoData.map(crypto => (
                <div key={crypto.id} className="crypto-item">
                  <div className="crypto-info">
                    <span className="crypto-name">{crypto.name}</span>
                    <span className="crypto-symbol">{crypto.symbol}</span>
                  </div>
                  <div className="crypto-price">
                    <span className="price">${crypto.price.toLocaleString()}</span>
                    <span className={`change ${crypto.change >= 0 ? 'positive' : 'negative'}`}>
                      {crypto.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {crypto.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Form */}
          <div className="trade-form">
            <h3>Execute Trade</h3>
            
            <div className="trade-type-selector">
              <button 
                className={`trade-type-btn ${tradeType === 'buy' ? 'active buy' : ''}`}
                onClick={() => setTradeType('buy')}
              >
                BUY
              </button>
              <button 
                className={`trade-type-btn ${tradeType === 'sell' ? 'active sell' : ''}`}
                onClick={() => setTradeType('sell')}
              >
                SELL
              </button>
            </div>

            <div className="form-group">
              <label>Cryptocurrency</label>
              <select 
                value={selectedCoin} 
                onChange={(e) => setSelectedCoin(e.target.value)}
              >
                <option value="">Select Cryptocurrency</option>
                {cryptoData.map(crypto => (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Exchange</label>
              <select 
                value={selectedExchange} 
                onChange={(e) => setSelectedExchange(e.target.value)}
              >
                <option value="">Select Exchange</option>
                {exchanges.map(exchange => (
                  <option key={exchange} value={exchange}>{exchange}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Amount</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              
              <div className="form-group">
                <label>Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {amount && price && (
              <div className="trade-summary">
                <p>Total: ${(parseFloat(amount) * parseFloat(price)).toFixed(2)}</p>
              </div>
            )}

            <button className="execute-btn" onClick={executeTrade}>
              <Activity size={20} />
              Execute {tradeType.toUpperCase()} Order
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio & History */}
      <div className="bottom-section">
        <div className="portfolio-section">
          <h3>Your Portfolio</h3>
          {portfolio.length === 0 ? (
            <p className="empty-state">No holdings yet. Execute your first trade to get started!</p>
          ) : (
            <div className="portfolio-list">
              {portfolio.map((asset, index) => (
                <div key={index} className="portfolio-item">
                  <div className="asset-info">
                    <span className="asset-name">{asset.coinName}</span>
                    <span className="asset-exchange">{asset.exchange}</span>
                  </div>
                  <div className="asset-details">
                    <span className="asset-amount">{asset.amount.toFixed(6)} {asset.coinSymbol}</span>
                    <span className="asset-value">
                      ${(asset.amount * asset.currentPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="history-section">
          <h3>Trade History</h3>
          {tradeHistory.length === 0 ? (
            <p className="empty-state">No trades executed yet.</p>
          ) : (
            <div className="history-list">
              {tradeHistory.slice(0, 5).map(trade => (
                <div key={trade.id} className="history-item">
                  <div className="trade-info">
                    <span className={`trade-action ${trade.action}`}>
                      {trade.action.toUpperCase()}
                    </span>
                    <span className="trade-coin">{trade.coinName}</span>
                  </div>
                  <div className="trade-details">
                    <span className="trade-amount">{trade.amount.toFixed(6)}</span>
                    <span className="trade-total">${trade.total.toFixed(2)}</span>
                  </div>
                  <div className="trade-time">{trade.timestamp}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trade;