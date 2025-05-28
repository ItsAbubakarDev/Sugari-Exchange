import React from 'react';
import FirstHomePart from '../Components/FirstHomePart';
import TradingViewWidget from '../Components/TradingViewWidget';
import FeaturedCoins from '../Components/FeaturedCoins';
import { Link } from 'react-router-dom';

function Home() {
    return(
        <>
        
        <FirstHomePart></FirstHomePart>
        <TradingViewWidget></TradingViewWidget>
        <FeaturedCoins></FeaturedCoins>
        
        
        </>
    )
}

export default Home;