import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './Components/Portfolio.jsx'; 
import Trade from './Components/Trade.jsx';
import TradeHistory from './Components/TradeHistory.jsx';
import Home from './Pages/home.jsx';
import Footer from './Components/Footer.jsx'; 
import Header from './Components/Header.jsx';
import SignUp from './Components/SignUp.jsx';
import SignIn from './Components/SignIn.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/trade-history" element={<TradeHistory />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
