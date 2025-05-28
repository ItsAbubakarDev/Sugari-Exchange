import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Components/SignUp.jsx'; 
import SignIn from './Components/SignIn.jsx'; 
import Portfolio from './Components/Portfolio.jsx'; 
import Trade from './Components/Trade.jsx';
import TradeHistory from './Components/TradeHistory.jsx';
import Home from './Pages/home.jsx';
import Footer from './Components/Footer.jsx'; 
import Header from './Components/Header.jsx';
function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/trade-history" element={<TradeHistory />} />
        <Route path="/" element={<Home />} />
      </Routes>
    <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
