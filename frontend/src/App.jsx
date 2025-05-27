import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Components/SignUp.jsx'; 
import SignIn from './Components/SignIn.jsx'; 
import Portfolio from './Components/CreatePortfolio.jsx'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
