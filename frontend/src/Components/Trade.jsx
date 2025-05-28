import React, { useState, useEffect } from 'react';

const Trade = () => {
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
  const [showTradeHistory, setShowTradeHistory] = useState(false);

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

  const getAssetBalance = (exchange, coinId) => {
    if (!portfolio?.assets) return 0;
    const asset = portfolio.assets.find(a => a.exchange === exchange && a.coinId === coinId);
    return asset ? asset.amount : 0;
  };

  const calculateTradeValue = () => {
    if (tradeData.price && tradeData.amount) {
      return (parseFloat(tradeData.price) * parseFloat(tradeData.amount)).toFixed(2);
    }
    return '0.00';
  };

  const calculatePortfolioValue = () => {
    if (!portfolio?.assets || portfolio.assets.length === 0) return 0;
    return portfolio.assets.reduce((total, asset) => total + (asset.amount * asset.price), 0).toFixed(2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '1rem'
    },
    description: {
      fontSize: '1.1rem',
      color: '#64748b',
      lineHeight: '1.6',
      maxWidth: '800px',
      margin: '0 auto'
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      '@media (max-Width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    tabContainer: {
      display: 'flex',
      marginBottom: '1.5rem',
      backgroundColor: '#f1f5f9',
      borderRadius: '8px',
      padding: '4px'
    },
    tab: {
      flex: 1,
      padding: '0.75rem 1rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    activeTab: {
      backgroundColor: 'white',
      color: '#3b82f6',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    inactiveTab: {
      color: '#64748b'
    },
    formSection: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    formTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '1.5rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '1rem',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '1rem',
      backgroundColor: 'white',
      boxSizing: 'border-box'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    balanceInfo: {
      padding: '0.75rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '6px',
      fontSize: '0.875rem',
      color: '#4b5563',
      marginBottom: '1rem'
    },
    tradeSummary: {
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '6px',
      marginBottom: '1.5rem'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    tradeValue: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#059669'
    },
    tradeButton: {
      width: '100%',
      padding: '0.875rem',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textTransform: 'uppercase'
    },
    buyButton: {
      backgroundColor: '#059669',
      color: 'white'
    },
    sellButton: {
      backgroundColor: '#dc2626',
      color: 'white'
    },
    portfolioSection: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    assetsGrid: {
      display: 'grid',
      gap: '1rem'
    },
    assetCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
      backgroundColor: '#fafafa'
    },
    assetHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.75rem'
    },
    assetTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    exchangeBadge: {
      padding: '0.25rem 0.5rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '4px',
      fontSize: '0.75rem',
      textTransform: 'uppercase'
    },
    assetRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem'
    },
    assetValue: {
      fontWeight: '600',
      color: '#059669'
    },
    message: {
      padding: '0.75rem',
      borderRadius: '6px',
      marginTop: '1rem',
      fontSize: '0.875rem'
    },
    successMessage: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: '1px solid #a7f3d0'
    },
    errorMessage: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fca5a5'
    },
    emptyPortfolio: {
      textAlign: 'center',
      padding: '2rem',
      color: '#6b7280'
    },
    portfolioValue: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#059669',
      textAlign: 'center',
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: '#f0fdf4',
      borderRadius: '8px',
      border: '2px solid #bbf7d0'
    },
    tradeHistoryContainer: {
      maxHeight: '400px',
      overflowY: 'auto'
    },
    tradeHistoryItem: {
      padding: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '0.5rem',
      backgroundColor: '#fafafa'
    },
    tradeAction: {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    buyAction: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    sellAction: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Crypto Trading Simulator</h1>
        <p style={styles.description}>
          Practice cryptocurrency trading with real-time portfolio management. 
          Execute buy and sell orders across multiple exchanges and track your performance.
          Your trades are simulated but your portfolio changes are persistent.
        </p>
      </div>

      <div style={styles.content}>
        <div style={styles.formSection}>
          <h2 style={styles.formTitle}>Execute Trade</h2>
          <div onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="action">Action</label>
              <select
                id="action"
                name="action"
                value={tradeData.action}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="exchange">Exchange</label>
              <select
                id="exchange"
                name="exchange"
                value={tradeData.exchange}
                onChange={handleInputChange}
                style={styles.select}
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

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="coinId">Cryptocurrency</label>
              <select
                id="coinId"
                name="coinId"
                value={tradeData.coinId}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="">Select Coin</option>
                {popularCoins.map(coin => (
                  <option key={coin} value={coin}>
                    {coin.charAt(0).toUpperCase() + coin.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="price">Price (USD)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={tradeData.price}
                  onChange={handleInputChange}
                  step="0.000001"
                  min="0"
                  placeholder="0.00"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={tradeData.amount}
                  onChange={handleInputChange}
                  step="0.000001"
                  min="0"
                  placeholder="0.00"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {tradeData.exchange && tradeData.coinId && (
              <div style={styles.balanceInfo}>
                <span>Available Balance: {getAssetBalance(tradeData.exchange, tradeData.coinId)} {tradeData.coinId}</span>
              </div>
            )}

            <div style={styles.tradeSummary}>
              <div style={styles.summaryRow}>
                <span>Trade Value:</span>
                <span style={styles.tradeValue}>${calculateTradeValue()}</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleSubmit}
              style={{
                ...styles.tradeButton,
                ...(tradeData.action === 'buy' ? styles.buyButton : styles.sellButton)
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : `${tradeData.action.toUpperCase()} ${tradeData.coinId || 'CRYPTO'}`}
            </button>
          </div>

          {message && (
            <div style={{
              ...styles.message,
              ...(messageType === 'success' ? styles.successMessage : styles.errorMessage)
            }}>
              {message}
            </div>
          )}
        </div>

        <div style={styles.portfolioSection}>
          <div style={styles.tabContainer}>
            <button 
              style={{
                ...styles.tab,
                ...(showTradeHistory ? styles.inactiveTab : styles.activeTab)
              }}
              onClick={() => setShowTradeHistory(false)}
            >
              Portfolio
            </button>
            <button 
              style={{
                ...styles.tab,
                ...(showTradeHistory ? styles.activeTab : styles.inactiveTab)
              }}
              onClick={() => setShowTradeHistory(true)}
            >
              Trade History
            </button>
          </div>

          {!showTradeHistory ? (
            <>
              <h2 style={styles.formTitle}>Current Portfolio</h2>
              {portfolio?.assets && portfolio.assets.length > 0 && (
                <div style={styles.portfolioValue}>
                  Total Portfolio Value: ${calculatePortfolioValue()}
                </div>
              )}
              <div>
                {portfolio?.assets && portfolio.assets.length > 0 ? (
                  <div style={styles.assetsGrid}>
                    {portfolio.assets.map((asset, index) => (
                      <div key={index} style={styles.assetCard}>
                        <div style={styles.assetHeader}>
                          <h3 style={styles.assetTitle}>{asset.coinId.charAt(0).toUpperCase() + asset.coinId.slice(1)}</h3>
                          <span style={styles.exchangeBadge}>{asset.exchange}</span>
                        </div>
                        <div>
                          <div style={styles.assetRow}>
                            <span>Amount:</span>
                            <span>{asset.amount}</span>
                          </div>
                          <div style={styles.assetRow}>
                            <span>Price:</span>
                            <span>${asset.price}</span>
                          </div>
                          <div style={styles.assetRow}>
                            <span>Value:</span>
                            <span style={styles.assetValue}>${(asset.amount * asset.price).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyPortfolio}>
                    <p>No assets in portfolio yet. Start trading to build your portfolio!</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 style={styles.formTitle}>Recent Trades</h2>
              <div style={styles.tradeHistoryContainer}>
                {trades && trades.length > 0 ? (
                  trades.map((trade, index) => (
                    <div key={index} style={styles.tradeHistoryItem}>
                      <div style={styles.assetHeader}>
                        <div>
                          <span style={{
                            ...styles.tradeAction,
                            ...(trade.action === 'buy' ? styles.buyAction : styles.sellAction)
                          }}>
                            {trade.action}
                          </span>
                          <span style={{ marginLeft: '0.5rem', fontWeight: '600' }}>
                            {trade.coinId.charAt(0).toUpperCase() + trade.coinId.slice(1)}
                          </span>
                        </div>
                        <span style={styles.exchangeBadge}>{trade.exchange}</span>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={styles.assetRow}>
                          <span>Amount:</span>
                          <span>{trade.amount}</span>
                        </div>
                        <div style={styles.assetRow}>
                          <span>Price:</span>
                          <span>${trade.price}</span>
                        </div>
                        <div style={styles.assetRow}>
                          <span>Total:</span>
                          <span style={styles.assetValue}>${(trade.amount * trade.price).toFixed(2)}</span>
                        </div>
                        <div style={styles.assetRow}>
                          <span>Date:</span>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {formatDate(trade.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.emptyPortfolio}>
                    <p>No trades executed yet. Start trading to see your history!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trade;