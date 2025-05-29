import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './Components/Portfolio.jsx'; 
import Trade from './Components/Trade.jsx';
import TradeHistory from './Components/TradeHistory.jsx';
import Home from './Pages/home.jsx';
import Footer from './Components/Footer.jsx'; 
import Header from './Components/Header.jsx';
import SignUp from './Components/SignUp.jsx';
import SignIn from './Components/SignIn.jsx';
import Coins from './Components/coins.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>   
        <Route path="tradehistory" element={<TradeHistory />} />
        <Route path="/trade" element={<Trade />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
