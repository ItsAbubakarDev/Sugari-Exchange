import React, { useState, useEffect } from 'react';
import './FirstHomePart.css';

const FirstHomePart = () => {
  const [cryptoPrices, setCryptoPrices] = useState({
    bitcoin: 0,
    ethereum: 0,
    dogecoin: 0,
  });

  const fetchPrices = async () => {
    try {
      const url =
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd';
      const response = await fetch(url);
      const data = await response.json();

      setCryptoPrices({
        bitcoin: data.bitcoin.usd,
        ethereum: data.ethereum.usd,
        dogecoin: data.dogecoin.usd,
      });
    } catch (error) {
      console.error('Failed to fetch cryptocurrency prices:', error);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="first-home-container">
      <div className="first-home-content">
        <h1>
          BUY & <br /> SELL <span>CRYPTO</span>
        </h1>
        <p>
          World's biggest Cryptocurrency exchange available on web <br />
          as well as mobile phone
        </p>
        <a href="#" className="explore-btn">
          Explore More
        </a>
      </div>

      <div className="crypto-coin-list">
        <div className="crypto-coin">
          <img src="/bitcoin.png" alt="Bitcoin" />
          <div>
            <h3>${cryptoPrices.bitcoin.toLocaleString()}</h3>
            <p>Bitcoin</p>
          </div>
        </div>

        <div className="crypto-coin">
          <img src="/ethereum.png" alt="Ethereum" />
          <div>
            <h3>${cryptoPrices.ethereum.toLocaleString()}</h3>
            <p>Ethereum</p>
          </div>
        </div>

        <div className="crypto-coin">
          <img src="/dogecoin.png" alt="Dogecoin" />
          <div>
            <h3>${cryptoPrices.dogecoin.toLocaleString()}</h3>
            <p>Doge Coin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstHomePart;
