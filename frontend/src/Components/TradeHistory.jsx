import React, { useState, useEffect } from 'react';
import './TradeHistory.css';

const TradeHistory = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Available options for dropdowns
  const [availableCoins, setAvailableCoins] = useState([]);
  const [availableExchanges, setAvailableExchanges] = useState([]);
  
  // Filters
  const [filters, setFilters] = useState({
    coinId: '',
    action: '',
    exchange: ''
  });

  // Fetch available coins and exchanges for dropdowns
  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/tradeHistory/getTradeHistory?limit=1000', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Extract unique coins and exchanges
          const coins = [...new Set(data.data.map(trade => trade.coinId))].sort();
          const exchanges = [...new Set(data.data.map(trade => trade.exchange))].sort();
          
          setAvailableCoins(coins);
          setAvailableExchanges(exchanges);
        }
      }
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
    }
  };

  // Fetch trade history
  const fetchTradeHistory = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.coinId && { coinId: filters.coinId }),
        ...(filters.action && { action: filters.action }),
        ...(filters.exchange && { exchange: filters.exchange })
      });

      const response = await fetch(`/api/tradeHistory/getTradeHistory?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trade history');
      }

      const data = await response.json();
      
      if (data.success) {
        setTrades(data.data);
        setPagination(data.pagination);
        setError(null);
      } else {
        throw new Error('Failed to load trade history');
      }
    } catch (err) {
      setError(err.message);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFilterOptions();
    fetchTradeHistory(1);
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchTradeHistory(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      coinId: '',
      action: '',
      exchange: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => fetchTradeHistory(1), 100);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchTradeHistory(newPage);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Format price
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Format amount
  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(6);
  };

  if (loading && trades.length === 0) {
    return (
      <div className="trade-history-container">
        <div className="trade-history-loading">
          <div className="trade-history-spinner"></div>
          <p>Loading trade history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trade-history-container">
      <div className="trade-history-header">
        <h1 className="trade-history-title">Trade History</h1>
        <p className="trade-history-subtitle">View and filter your trading activity</p>
      </div>

      {/* Filters */}
      <div className="trade-history-filters">
        <div className="trade-history-filter-group">
          <label className="trade-history-filter-label">Coin</label>
          <select
            className="trade-history-filter-select"
            value={filters.coinId}
            onChange={(e) => handleFilterChange('coinId', e.target.value)}
          >
            <option value="">All Coins</option>
            {availableCoins.map(coin => (
              <option key={coin} value={coin}>
                {coin.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="trade-history-filter-group">
          <label className="trade-history-filter-label">Action</label>
          <select
            className="trade-history-filter-select"
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
          >
            <option value="">All Actions</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div className="trade-history-filter-group">
          <label className="trade-history-filter-label">Exchange</label>
          <select
            className="trade-history-filter-select"
            value={filters.exchange}
            onChange={(e) => handleFilterChange('exchange', e.target.value)}
          >
            <option value="">All Exchanges</option>
            {availableExchanges.map(exchange => (
              <option key={exchange} value={exchange}>
                {exchange.charAt(0).toUpperCase() + exchange.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="trade-history-filter-actions">
          <button className="trade-history-btn-apply" onClick={applyFilters}>
            Apply Filters
          </button>
          <button className="trade-history-btn-clear" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="trade-history-error">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Trade table */}
      {trades.length > 0 ? (
        <div className="trade-history-table-container">
          <table className="trade-history-table">
            <thead className="trade-history-table-head">
              <tr>
                <th>Date</th>
                <th>Coin ID</th>
                <th>Exchange</th>
                <th>Action</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody className="trade-history-table-body">
              {trades.map((trade) => (
                <tr key={trade._id} className="trade-history-table-row">
                  <td className="trade-history-table-cell">
                    {formatDate(trade.createdAt)}
                  </td>
                  <td className="trade-history-table-cell trade-history-coin-id">
                    {trade.coinId}
                  </td>
                  <td className="trade-history-table-cell">
                    {trade.exchange}
                  </td>
                  <td className="trade-history-table-cell">
                    <span className={`trade-history-action trade-history-action-${trade.action}`}>
                      {trade.action.toUpperCase()}
                    </span>
                  </td>
                  <td className="trade-history-table-cell trade-history-price">
                    {formatPrice(trade.price)}
                  </td>
                  <td className="trade-history-table-cell trade-history-amount">
                    {formatAmount(trade.amount)}
                  </td>
                  <td className="trade-history-table-cell trade-history-total">
                    {formatPrice(trade.price * trade.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <div className="trade-history-empty">
            <p>No trades found matching your criteria.</p>
          </div>
        )
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="trade-history-pagination">
          <button
            className="trade-history-pagination-btn"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>

          <div className="trade-history-pagination-info">
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <span className="trade-history-pagination-total">
              ({pagination.total} total trades)
            </span>
          </div>

          <button
            className="trade-history-pagination-btn"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}

      {/* Loading overlay for pagination */}
      {loading && trades.length > 0 && (
        <div className="trade-history-loading-overlay">
          <div className="trade-history-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default TradeHistory;