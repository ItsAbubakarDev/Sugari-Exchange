import React, { useState, useEffect } from "react";
import "./portfolio.css";

const Portfolio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [assetForm, setAssetForm] = useState({
    exchange: "binance",
    coinId: "",
    price: "",
    amount: "",
    action: "buy"
  });

  // Check if portfolio exists on component mount
  useEffect(() => {
    checkPortfolioExists();
  }, []);

  const checkPortfolioExists = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:3001/api/portfolio/displayPortfolio", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.log("No existing portfolio found");
    }
  };

  const handleCreatePortfolio = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch("http://localhost:3001/api/portfolio/createPortfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textContent = await response.text();
        throw new Error(`Server returned non-JSON response: ${textContent || 'Empty response'}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setSuccessMessage("Portfolio created successfully!");
      setPortfolio(data);

    } catch (err) {
      console.error("Create portfolio error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePortfolio = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch("http://localhost:3001/api/portfolio/updatePortfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...assetForm,
          price: parseFloat(assetForm.price),
          amount: parseFloat(assetForm.amount)
        }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textContent = await response.text();
        throw new Error(`Server returned non-JSON response: ${textContent || 'Empty response'}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setSuccessMessage(`Asset ${assetForm.action === 'buy' ? 'added' : 'sold'} successfully!`);
      setPortfolio(data);
      setShowAddAsset(false);
      setAssetForm({
        exchange: "binance",
        coinId: "",
        price: "",
        amount: "",
        action: "buy"
      });

    } catch (err) {
      console.error("Update portfolio error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalValue = () => {
    if (!portfolio || !portfolio.assets) return 0;
    return portfolio.assets.reduce((total, asset) => {
      return total + (asset.price * asset.amount);
    }, 0).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssetForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h1>My Investment Portfolio</h1>
        <p className="portfolio-description">
          Welcome to your personal investment portfolio dashboard. Here you can track all your cryptocurrency investments across different exchanges. 
          Start by creating your portfolio and then add your assets to monitor your investment performance in real-time.
        </p>
      </div>

      {error && <div className="message error-message">{error}</div>}
      {successMessage && <div className="message success-message">{successMessage}</div>}

      {!portfolio ? (
        <div className="no-portfolio">
          <div className="portfolio-info">
            <h2>Create Your Portfolio</h2>
            <p>
              You haven't created a portfolio yet. Click the button below to get started with your investment journey. 
              Your portfolio will be initialized with 500 USDT to help you begin trading.
            </p>
          </div>
          <button 
            className="create-btn" 
            onClick={handleCreatePortfolio} 
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Portfolio"}
          </button>
        </div>
      ) : (
        <div className="portfolio-content">
          <div className="portfolio-summary">
            <h2>Portfolio Overview</h2>
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Assets</h3>
                <p className="summary-value">{portfolio.assets?.length || 0}</p>
              </div>
              <div className="summary-card">
                <h3>Total Value</h3>
                <p className="summary-value">${calculateTotalValue()}</p>
              </div>
            </div>
          </div>

          {(!portfolio.assets || portfolio.assets.length === 0) ? (
            <div className="no-assets">
              <h3>No Assets Yet</h3>
              <p>You haven't added any assets to your portfolio yet. Start by adding your first cryptocurrency investment.</p>
            </div>
          ) : (
            <div className="assets-list">
              <h3>Your Assets</h3>
              <div className="assets-grid">
                {portfolio.assets.map((asset, index) => (
                  <div key={index} className="asset-card">
                    <div className="asset-header">
                      <h4>{asset.coinId}</h4>
                      <span className="exchange-badge">{asset.exchange}</span>
                    </div>
                    <div className="asset-details">
                      <div className="asset-info">
                        <span className="label">Amount:</span>
                        <span className="value">{asset.amount}</span>
                      </div>
                      <div className="asset-info">
                        <span className="label">Price:</span>
                        <span className="value">${asset.price}</span>
                      </div>
                      <div className="asset-info">
                        <span className="label">Total Value:</span>
                        <span className="value total-value">${(asset.price * asset.amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="portfolio-actions">
            <button 
              className="add-asset-btn"
              onClick={() => setShowAddAsset(!showAddAsset)}
            >
              {showAddAsset ? "Cancel" : "Update Asset"}
            </button>
          </div>

          {showAddAsset && (
            <div className="asset-form-container">
              <h3>Add or Update Asset</h3>
              <form onSubmit={handleUpdatePortfolio} className="asset-form">
                <div className="form-group">
                  <label>Exchange</label>
                  <select
                    name="exchange"
                    value={assetForm.exchange}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="binance">Binance</option>
                    <option value="coinbase">Coinbase</option>
                    <option value="kraken">Kraken</option>
                    <option value="bybit">Bybit</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Cryptocurrency</label>
                  <input
                    type="text"
                    name="coinId"
                    placeholder="e.g., BTC, ETH, ADA"
                    value={assetForm.coinId}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    placeholder="0.00"
                    value={assetForm.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    placeholder="0.00"
                    value={assetForm.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Action</label>
                  <select
                    name="action"
                    value={assetForm.action}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Processing..." : `${assetForm.action === 'buy' ? 'Buy' : 'Sell'} Asset`}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Portfolio;