import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './coins.css';

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);

  // Fetch coins from API
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/coins/getCoins');
        setCoins(response.data);
        setFilteredCoins(response.data);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(response.data.map(coin => coin.category))];
        setCategories(uniqueCategories);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch coins data');
        console.error('Error fetching coins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  // Filter coins based on search term and category
  useEffect(() => {
    let filtered = coins;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(coin => coin.category === selectedCategory);
    }

    setFilteredCoins(filtered);
  }, [searchTerm, selectedCategory, coins]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatChange = (change) => {
    return change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="coins-container">
        <div className="loading">Loading coins...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coins-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="coins-container">
      <div className="coins-header">
        <h1>Cryptocurrency Coins</h1>
        
        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search coins by name or symbol..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="coins-stats">
        <p>Showing {filteredCoins.length} of {coins.length} coins</p>
      </div>

      <div className="coins-grid">
        {filteredCoins.length > 0 ? (
          filteredCoins.map((coin) => (
            <div key={coin.coinId} className="coin-card">
              <div className="coin-header">
                <h3 className="coin-name">{coin.name}</h3>
                <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
              </div>
              
              <div className="coin-info">
                <div className="coin-category">
                  <span className="category-label">Category:</span>
                  <span className="category-value">{coin.category}</span>
                </div>
                
                <div className="coin-price">
                  <span className="price-label">Current Price:</span>
                  <span className="price-value">{formatPrice(coin.current_price)}</span>
                </div>
                
                <div className="coin-change">
                  <span className="change-label">24h Change:</span>
                  <span className={`change-value ${coin.change >= 0 ? 'positive' : 'negative'}`}>
                    {formatChange(coin.change)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No coins found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coins;