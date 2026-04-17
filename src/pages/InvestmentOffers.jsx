import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InvestmentOffers.css';

const plans = [
    { name: 'Commence 0.5%', rate: 0.5, days: 500, min: 30, max: 499 },
    { name: 'General 1%', rate: 1, days: 300, min: 500, max: 4999 },
    { name: 'VIP I 2%', rate: 2, days: 180, min: 5000, max: 24999 },
    { name: 'VIP II 3%', rate: 3, days: 120, min: 25000, max: 49999 },
    { name: 'Supreme I 4%', rate: 4, days: 90, min: 50000, max: 99999 },
    { name: 'Supreme II 5%', rate: 5, days: 60, min: 100000, max: 199999 },
    { name: 'Royal 6%', rate: 6, days: 45, min: 200000, max: 499999 },
    { name: 'Royal Plus 7%', rate: 7, days: 30, min: 500000, max: 999999 },
    { name: 'Exclusive 10%', rate: 10, days: 20, min: 1000000, max: null },
];

const InvestmentOffers = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState(30);
    const [selectedPlan, setSelectedPlan] = useState(plans[0]);

    const earnings = ((amount * selectedPlan.rate) / 100) * selectedPlan.days;
    const totalReturn = Number(amount) + earnings;
    const earningsPercent = ((earnings / amount) * 100).toFixed(2);

    const handleMakeDeposit = () => {
        navigate('/dashboard');
    };

    return (
        <div className="io-page">
            {/* Hero Banner */}
            <div className="io-hero">
                <div className="io-hero-overlay" />
                <div className="io-hero-content">
                    <h1>Investment offers</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="io-main">
                {/* Left Column - Descriptions */}
                <div className="io-descriptions">
                    <p className="io-intro">
                        The Investment Smart Crypto Investing investment plans are of several types, each with its own conditions
                        and benefits, giving each investor the opportunity to create the best investment strategy for
                        themselves.
                    </p>
                    <p>
                        For example, if you prefer to have access to your earnings every business day, the{' '}
                        <strong>COMMENCE and SYSTEMATIC</strong> plans would be a good choice for you.
                        <br />
                        Profits are accrued into your account every business day and can be withdrawn at any time.
                        The principal amount is paid at the end of the maturity period.
                    </p>

                    <div className="io-plan-desc">
                        <h4>GENERAL</h4>
                        <p>
                            plans are an easy and affordable way to increase your income by investing a small amount of money.
                            Your earnings are accrued into your account every business day.
                            However, the earnings and your principal amount can only be withdrawn at the end of the maturity period.
                        </p>
                    </div>

                    <div className="io-plan-desc">
                        <h4>VIP</h4>
                        <p>
                            plans provide an amazing opportunity to accumulate funds, multiply them repeatedly and get a solid
                            capital at the end of the maturity period that would help you make your dreams come true.
                            Your earnings are paid into your account only once — at the end of the maturity period. The earnings
                            and your principal amount can be withdrawn by you at the end of the maturity period all at the same
                            time.
                        </p>
                    </div>

                    <div className="io-plan-desc">
                        <h4>ROYAL and ROYAL PLUS</h4>
                        <p>
                            plans open up a wide prospect for capital growth and are a unique and lucrative offer for those who
                            are focused on ambitious goals, strong results and intend to achieve them. Your earnings are accrued
                            into your account every business day.
                            However, the earnings and your principal amount can only be withdrawn at the end of the maturity period.
                        </p>
                    </div>

                    <div className="io-plan-desc">
                        <h4>EXCLUSIVE</h4>
                        <p>
                            plans are ideal for those operating with large amounts and know what to do with them.
                            It is an excellent choice for those who want to maximize their profit in the shortest possible time.
                            Profits are accrued out daily, every business day. However, the earnings and your principal amount
                            can only be withdrawn at the end of the maturity period.
                        </p>
                    </div>

                    <div className="io-tagline">
                        <h3>We are inspired to help you never stop doing what you love and loving what you do. Investment Smart Crypto Investing — values matter!</h3>
                    </div>
                </div>

                {/* Right Column - Profit Calculator */}
                <div className="io-calculator">
                    <h2 className="io-calc-title">Calculate your profit</h2>
                    <div className="io-calc-card">
                        {/* Slider */}
                        <div className="io-slider-wrapper">
                            <span className="io-slider-min">30</span>
                            <input
                                type="range"
                                min="30"
                                max="1000000"
                                step="10"
                                value={amount}
                                onChange={e => setAmount(Number(e.target.value))}
                                className="io-slider"
                            />
                            <span className="io-slider-max">∞</span>
                        </div>

                        {/* Inputs Grid */}
                        <div className="io-calc-grid">
                            <div className="io-calc-field">
                                <label>Amount:</label>
                                <input
                                    type="number"
                                    value={amount}
                                    min="30"
                                    onChange={e => setAmount(Number(e.target.value))}
                                />
                            </div>
                            <div className="io-calc-field">
                                <label>Investment plan:</label>
                                <select
                                    value={selectedPlan.name}
                                    onChange={e => setSelectedPlan(plans.find(p => p.name === e.target.value))}
                                >
                                    {plans.map(p => (
                                        <option key={p.name} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="io-calc-field">
                                <label>BillGain (%):</label>
                                <select defaultValue="0">
                                    <option value="0">0%</option>
                                </select>
                            </div>
                            <div className="io-calc-field">
                                <label>Business days:</label>
                                <input type="text" value={selectedPlan.days} readOnly />
                            </div>
                            <div className="io-calc-field">
                                <label>Earnings (%):</label>
                                <input type="text" value={`${earningsPercent}%`} readOnly />
                            </div>
                            <div className="io-calc-field">
                                <label>Total return ($):</label>
                                <input type="text" value={`$${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} readOnly />
                            </div>
                        </div>

                        {/* Make Deposit Button */}
                        <button className="io-deposit-btn" onClick={handleMakeDeposit}>
                            MAKE A DEPOSIT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestmentOffers;
