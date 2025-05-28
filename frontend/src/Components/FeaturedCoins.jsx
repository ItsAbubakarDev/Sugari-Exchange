import React, { useState, useEffect } from 'react';
import './FeaturedCoins.css';

const FeaturedCoins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const coinIds = [
    'bitcoin',
    'ethereum',
    'tether',
    'binancecoin',
    'solana',
    'xrp',
    'dogecoin',
    'cardano',
    'avalanche-2',
    'chainlink'
  ];

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setCoins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();

    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const formatCirculatingSupply = (supply, symbol) => {
    if (!supply) return 'N/A';
    
    if (supply >= 1e12) {
      return `${(supply / 1e12).toFixed(2)}T ${symbol}`;
    } else if (supply >= 1e9) {
      return `${(supply / 1e9).toFixed(2)}B ${symbol}`;
    } else if (supply >= 1e6) {
      return `${(supply / 1e6).toFixed(2)}M ${symbol}`;
    } else if (supply >= 1e3) {
      return `${(supply / 1e3).toFixed(2)}K ${symbol}`;
    } else {
      return `${supply.toLocaleString()} ${symbol}`;
    }
  };

  const formatPercentage = (percentage) => {
    if (percentage === null || percentage === undefined) return 'N/A';
    const formatted = percentage.toFixed(2);
    return `${percentage >= 0 ? '+' : ''}${formatted}%`;
  };

  if (loading) {
    return (
      <div className="featured-coins">
        <div className="container">
          <h2 className="title">Featured Cryptocurrencies</h2>
          <div className="loading">Loading cryptocurrency data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured-coins">
        <div className="container">
          <h2 className="title">Featured Cryptocurrencies</h2>
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-coins">
      <div className="container">
        <h2 className="title">Featured Cryptocurrencies</h2>
        
        <div className="coins-table">
          {/* Header Row */}
          <div className="table-header">
            <div className="header-rank-name">
              <span className="rank-header">#</span>
              <span className="name-header">Name</span>
            </div>
            <div className="header-price">Price</div>
            <div className="header-change">24h Change</div>
            <div className="header-market-cap">Market Cap</div>
            <div className="header-supply">Circulating Supply</div>
          </div>

          {/* Coin Rows */}
          <div className="coins-list">
            {coins.map((coin, index) => (
              <div key={coin.id} className="coin-row">
                
                {/* Rank & Name */}
                <div className="coin-info">
                  <span className="rank">#{index + 1}</span>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="coin-logo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="coin-details">
                    <span className="coin-name">{coin.name}</span>
                    <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="price-section">
                  <span className="current-price">{formatPrice(coin.current_price)}</span>
                </div>

                {/* 24h Change */}
                <div className="change-section">
                  <span
                    className={`price-change ${
                      coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'
                    }`}
                  >
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </span>
                </div>

                {/* Market Cap */}
                <div className="market-cap-section">
                  <span className="market-cap-value">{formatMarketCap(coin.market_cap)}</span>
                </div>

                {/* Circulating Supply */}
                <div className="supply-section">
                  <span className="supply-value">
                    {formatCirculatingSupply(coin.circulating_supply, coin.symbol.toUpperCase())}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="footer">
          <p>Data provided by CoinGecko • Updates every 30 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCoins;