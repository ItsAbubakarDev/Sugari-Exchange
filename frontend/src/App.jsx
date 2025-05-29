import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './Components/Portfolio.jsx'; 
import Trade from './Components/Trade.jsx';
import TradeHistory from './Components/TradeHistory.jsx';
import Home from './Pages/home.jsx';
import Footer from './Components/Footer.jsx'; 
import Header from './Components/Header.jsx';
import SignUp from './Components/SignUp.jsx';
import SignIn from './Components/SignIn.jsx';
import Coins from './Components/Coins.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>  
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/trade-history" element={<TradeHistory />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="*" element={<h2>404: Page Not Found</h2>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
