import React, { useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import './AllStocks.css';

const AllStocks = () => {

    useEffect(() => {
        const container = document.getElementById('all-stocks-widget');
        if (container) {
            container.innerHTML = '';

            // Create the widget container div required by TradingView
            const widgetDiv = document.createElement('div');
            widgetDiv.className = 'tradingview-widget-container__widget';
            container.appendChild(widgetDiv);

            // Create the script element
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
            script.async = true;
            script.type = 'text/javascript';
            script.innerHTML = JSON.stringify({
                "width": "100%",
                "height": "100%",
                "defaultColumn": "overview",
                "defaultScreen": "most_capitalized",
                "market": "america",
                "showToolbar": true,
                "colorTheme": "light",
                "locale": "en",
                "isTransparent": false
            });
            container.appendChild(script);
        }
    }, []);

    return (
        <DashboardLayout activePage="stocks">
            <div className="all-stocks-page-inner" style={{ padding: '0', height: '85vh' }}>
                <div className="tradingview-widget-container" id="all-stocks-widget" style={{ height: '100%', width: '100%' }}></div>
            </div>
        </DashboardLayout>
    );
};

export default AllStocks;
