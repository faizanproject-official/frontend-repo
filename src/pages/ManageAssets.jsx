import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import './ManageAssets.css'; // Maintaining import, though styles are in Dashboard.css now as well

const ManageAssets = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/user');
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    // Generic Widget Loader
    const loadWidget = (containerId, title, symbols, height = "500") => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
                "colorTheme": "light",
                "dateRange": "12M",
                "showChart": false,
                "locale": "en",
                "largeChartUrl": "",
                "isTransparent": true,
                "showSymbolLogo": true,
                "showFloatingTooltip": false,
                "width": "100%",
                "height": height, 
                "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
                "plotLineColorFalling": "rgba(41, 98, 255, 1)",
                "gridLineColor": "rgba(240, 243, 250, 0)",
                "scaleFontColor": "rgba(106, 109, 120, 1)",
                "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
                "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
                "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
                "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
                "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
                "tabs": [
                    {
                        "title": title,
                        "symbols": symbols,
                        "originalTitle": title
                    }
                ]
            });
            container.appendChild(script);
        }
    };

    useEffect(() => {
        if (!loading) {
            // Increased height for STOCKS to prevent scrollbar (10 items)
            loadWidget('widget-stocks', 'STOCKS', [
                { "s": "NASDAQ:TSLA", "d": "Tesla" },
                { "s": "NASDAQ:NVDA", "d": "NVIDIA" },
                { "s": "NASDAQ:AAPL", "d": "Apple" },
                { "s": "NASDAQ:AMD", "d": "AMD" },
                { "s": "NASDAQ:MSTR", "d": "MicroStrategy" },
                { "s": "NASDAQ:META", "d": "Meta" },
                { "s": "NASDAQ:AMZN", "d": "Amazon" },
                { "s": "NASDAQ:MSFT", "d": "Microsoft" },
                { "s": "NASDAQ:GOOGL", "d": "Alphabet" },
                { "s": "NASDAQ:NFLX", "d": "Netflix" }
            ], "650");

            // Adjusted heights for others
            loadWidget('widget-indices', 'INDICES', [
                { "s": "FOREXCOM:SPXUSD", "d": "S&P 500 Index" },
                { "s": "FOREXCOM:NSXUSD", "d": "US 100 Cash CFD" },
                { "s": "FOREXCOM:DJI", "d": "Dow Jones Industrial Average Index" },
                { "s": "INDEX:NKY", "d": "Japan 225" },
                { "s": "INDEX:DEU40", "d": "DAX Index" },
                { "s": "FOREXCOM:UKXGBP", "d": "FTSE 100 Index" }
            ], "450");

            loadWidget('widget-bonds', 'BONDS', [
                { "s": "CBOT:ZB1!", "d": "T-Bond" },
                { "s": "CBOT:UB1!", "d": "Ultra T-Bond" },
                { "s": "EUREX:FGBL1!", "d": "Euro Bund" },
                { "s": "EUREX:FBTP1!", "d": "Euro BTP" },
                { "s": "EUREX:FGBM1!", "d": "Euro BOBL" }
            ], "400");

            loadWidget('widget-forex', 'FOREX', [
                { "s": "FX:EURUSD", "d": "EUR to USD" },
                { "s": "FX:GBPUSD", "d": "GBP to USD" },
                { "s": "FX:USDJPY", "d": "USD to JPY" },
                { "s": "FX:USDCHF", "d": "USD to CHF" },
                { "s": "FX:AUDUSD", "d": "AUD to USD" },
                { "s": "FX:USDCAD", "d": "USD to CAD" }
            ], "450");
        }
    }, [loading]);

    if (loading) {
        return (
            <DashboardLayout activePage="assets">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#64748b' }}>
                    Loading Asset Data...
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activePage="assets">
            <div className="assets-page-header">
                <h1 className="assets-title">All Assets</h1>
                
                <div className="assets-stats-row">
                    <div className="asset-stat-item">
                        Profit: <span className="asset-stat-value">$0.00 USD</span>
                        <span className="stat-subtext">profits on all trades</span>
                    </div>
                    <div className="asset-stat-item">
                        Holding Balance: <span className="asset-stat-value">${parseFloat(user?.holding_balance || 0).toFixed(2)} USD</span>
                        <span className="stat-subtext">tradable available balance</span>
                    </div>
                </div>
            </div>

            <div className="assets-widgets-stack" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="tradingview-widget-container" id="widget-stocks" style={{ width: '100%' }}></div>
                <div className="tradingview-widget-container" id="widget-indices" style={{ width: '100%' }}></div>
                <div className="tradingview-widget-container" id="widget-bonds" style={{ width: '100%' }}></div>
                <div className="tradingview-widget-container" id="widget-forex" style={{ width: '100%' }}></div>
            </div>
        </DashboardLayout>
    );
};

export default ManageAssets;
