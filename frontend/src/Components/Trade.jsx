import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Trade.css';

const Trade = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [trades, setTrades] = useState([]);
  const [tradeData, setTradeData] = useState({
    exchange: '',
    coinId: '',
    price: '',
    amount: '',
    action: 'buy'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Popular exchanges and coins for demo
  const exchanges = ['binance', 'coinbase', 'kraken', 'bybit', 'kucoin'];
  const popularCoins = ['bitcoin', 'ethereum', 'cardano', 'solana', 'dogecoin', 'litecoin', 'chainlink', 'polkadot'];

  useEffect(() => {
    fetchPortfolio();
    fetchTradeHistory();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const fetchTradeHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/trades', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTrades(data.slice(0, 10)); // Show last 10 trades
      }
    } catch (error) {
      console.error('Error fetching trade history:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTradeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/trades/executeTrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...tradeData,
          price: parseFloat(tradeData.price),
          amount: parseFloat(tradeData.amount)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Trade executed successfully! ${tradeData.action.toUpperCase()} ${tradeData.amount} ${tradeData.coinId} at ${tradeData.price}`);
        setMessageType('success');
        setPortfolio(data.portfolio);
        
        // Refresh trade history
        fetchTradeHistory();
        
        // Reset form
        setTradeData({
          exchange: '',
          coinId: '',
          price: '',
          amount: '',
          action: 'buy'
        });
      } else {
        setMessage(data.message || 'Trade execution failed');
        setMessageType('error');
      }

    } catch (error) {
      setMessage('Network error occurred');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const calculateTradeValue = () => {
    if (tradeData.price && tradeData.amount) {
      return (parseFloat(tradeData.price) * parseFloat(tradeData.amount)).toFixed(2);
    }
    return '0.00';
  };

  const getAssetBalance = (exchange, coinId) => {
    if (!portfolio?.assets) return 0;
    const asset = portfolio.assets.find(a => a.exchange === exchange && a.coinId === coinId);
    return asset ? asset.amount : 0;
  };

  // Navigate to Trade History page
  const handleViewTradeHistory = () => {
    navigate('/trade-history');
  };

  return (
    <div className="container">
      {/* Navigation Bar */}
      <div className="trade-navigation">
        <button 
          className="trade-nav-button"
          onClick={handleViewTradeHistory}
        >
          📊 View Trade History
        </button>
      </div>

      {/* Header Section */}
      <div className="header">
        <h1 className="title">Crypto Trading Simulator</h1>
        <p className="description">
          Practice cryptocurrency trading with our advanced simulation platform. 
          Execute buy and sell orders across multiple exchanges and experience real-time trading scenarios.
        </p>
        <div className="info-cards">
          <div className="info-card">
            <h3>Real-Time Simulation</h3>
            <p>Experience realistic trading conditions with live market data simulation</p>
          </div>
          <div className="info-card">
            <h3>Multiple Exchanges</h3>
            <p>Trade across popular cryptocurrency exchanges like Binance, Coinbase, and more</p>
          </div>
          <div className="info-card">
            <h3>Risk-Free Learning</h3>
            <p>Perfect your trading strategies without risking real money</p>
          </div>
        </div>
      </div>

      {/* Trade Simulation Section */}
      <div className="trade-section">
        <div className="trade-container">
          <h2 className="trade-title">Execute Trade</h2>
          <div className="trade-form">
            <div className="form-group">
              <label className="label" htmlFor="action">Trading Action</label>
              <select
                id="action"
                name="action"
                value={tradeData.action}
                onChange={handleInputChange}
                className="select"
                required
              >
                <option value="buy">Buy Order</option>
                <option value="sell">Sell Order</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label" htmlFor="exchange">Exchange Platform</label>
                <select
                  id="exchange"
                  name="exchange"
                  value={tradeData.exchange}
                  onChange={handleInputChange}
                  className="select"
                  required
                >
                  <option value="">Select Exchange</option>
                  {exchanges.map(exchange => (
                    <option key={exchange} value={exchange}>
                      {exchange.charAt(0).toUpperCase() + exchange.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="coinId">Cryptocurrency</label>
                <select
                  id="coinId"
                  name="coinId"
                  value={tradeData.coinId}
                  onChange={handleInputChange}
                  className="select"
                  required
                >
                  <option value="">Select Cryptocurrency</option>
                  {popularCoins.map(coin => (
                    <option key={coin} value={coin}>
                      {coin.charAt(0).toUpperCase() + coin.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label" htmlFor="price">Price per Unit (USD)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={tradeData.price}
                  onChange={handleInputChange}
                  step="0.000001"
                  min="0"
                  placeholder="0.00"
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="amount">Amount to Trade</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={tradeData.amount}
                  onChange={handleInputChange}
                  step="0.000001"
                  min="0"
                  placeholder="0.00"
                  className="input"
                  required
                />
              </div>
            </div>

            {tradeData.exchange && tradeData.coinId && (
              <div className="balance-info">
                <span>Available Balance: {getAssetBalance(tradeData.exchange, tradeData.coinId)} {tradeData.coinId}</span>
              </div>
            )}

            <div className="trade-summary">
              <div className="summary-row">
                <span className="summary-label">Total Trade Value:</span>
                <span className="trade-value">${calculateTradeValue()}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Trading Pair:</span>
                <span className="trade-pair">{tradeData.coinId ? `${tradeData.coinId.toUpperCase()}/USD` : 'Select cryptocurrency'}</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleSubmit}
              className={`trade-button ${tradeData.action === 'buy' ? 'buy-button' : 'sell-button'}`}
              disabled={loading}
            >
              {loading ? 'Processing Trade...' : `${tradeData.action.toUpperCase()} ${tradeData.coinId ? tradeData.coinId.toUpperCase() : 'CRYPTO'}`}
            </button>
          </div>

          {message && (
            <div className={`message ${messageType === 'success' ? 'success-message' : 'error-message'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trade;