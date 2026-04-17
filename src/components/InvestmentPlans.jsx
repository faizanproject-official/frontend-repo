import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './InvestmentPlans.css';

const plans = [
    {
        name: 'COMMENCE',
        dailyProfit: '2%',
        duration: '10 Days',
        minDeposit: '$200',
        referral: '2%',
        accruals: 'Every Day',
        principalReturn: 'Yes'
    },
    {
        name: 'SYSTEMATIC',
        dailyProfit: '15%',
        duration: '8 Days',
        minDeposit: '$15,000',
        referral: '3%',
        accruals: 'Every Day',
        principalReturn: 'Yes'
    },
    {
        name: 'GENERAL',
        dailyProfit: '20%',
        duration: '6 Days',
        minDeposit: '$30,000',
        referral: '5%',
        accruals: 'Every Day',
        principalReturn: 'Yes'
    },
    {
        name: 'EXTENSIVE',
        dailyProfit: '25%',
        duration: '4 Days',
        minDeposit: '$50,000',
        referral: '7%',
        accruals: 'Every Day',
        principalReturn: 'Yes'
    },
    {
        name: 'VIP I',
        dailyProfit: '30%',
        duration: '2 Days',
        minDeposit: '$100,000',
        referral: '10%',
        accruals: 'Every Day',
        principalReturn: 'Yes'
    },
    {
        name: 'VIP II',
        dailyProfit: '40%',
        duration: '15 Hours',
        minDeposit: '$150,000',
        referral: '10%',
        accruals: 'After 15 Hours',
        principalReturn: 'Yes'
    },
    {
        name: 'SUPREME I',
        dailyProfit: '50%',
        duration: '10 Hours',
        minDeposit: '$200,000',
        referral: '20%',
        accruals: 'After 10 Hours',
        principalReturn: 'Yes'
    },
    {
        name: 'SUPREME II',
        dailyProfit: '70%',
        duration: '15 Hours',
        minDeposit: '$250,000',
        referral: '20%',
        accruals: 'After 15 Hours',
        principalReturn: 'Yes'
    },
    {
        name: 'ROYAL I',
        dailyProfit: '80%',
        duration: '20 Hours',
        minDeposit: '$300,000',
        referral: '20%',
        accruals: 'After 20 Hours',
        principalReturn: 'Yes'
    },
    {
        name: 'ROYAL II',
        dailyProfit: '100%',
        duration: '24 Hours',
        minDeposit: '$400,000',
        referral: '25%',
        accruals: 'After 24 Hours',
        principalReturn: 'Yes'
    },
    {
        name: 'EXCLUSIVE',
        dailyProfit: '200%',
        duration: '40 Hours',
        minDeposit: '$500,000',
        referral: '80%',
        accruals: 'After 40 Hours',
        principalReturn: 'Yes'
    }
];

const InvestmentPlans = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    const handleChooseClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        } else {
            navigate('/signup');
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    return (
        <section className="investment-plans-section">
            <div className="plans-container-wrapper">
                <div className="section-header-top centered">
                    <div className="section-tag-pill">
                        <div className="dot-blue"></div>
                        <span className="tag-text">Investment Offers</span>
                    </div>
                    <h2 className="features-heading">Choose Your Investment Plan</h2>
                    <p className="features-description-text">Each offer with its own conditions and benefits!</p>
                </div>

                <div className="carousel-container">
                    <button className="nav-arrow left-arrow" onClick={scrollLeft}>
                        &#8249;
                    </button>

                    <div className="plans-grid" ref={scrollContainerRef}>
                        {plans.map((plan, index) => (
                            <div key={index} className="plan-card">
                                <div className="plan-header">
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <div className="plan-profit">{plan.dailyProfit}</div>
                                    <span className="daily-label">Daily Profit</span>
                                </div>

                                <div className="plan-body">
                                    <div className="plan-feature">
                                        <span className="feature-label">Duration:</span>
                                        <span className="feature-value">{plan.duration}</span>
                                    </div>
                                    <div className="plan-feature">
                                        <span className="feature-label">Min Deposit:</span>
                                        <span className="feature-value">{plan.minDeposit} and more</span>
                                    </div>
                                    <div className="plan-feature">
                                        <span className="feature-label">Accruals:</span>
                                        <span className="feature-value">{plan.accruals}</span>
                                    </div>
                                    <div className="plan-feature">
                                        <span className="feature-label">Principal Return:</span>
                                        <span className="feature-value">{plan.principalReturn}</span>
                                    </div>
                                    <div className="plan-feature">
                                        <span className="feature-label">Referral Commission:</span>
                                        <span className="feature-value">{plan.referral}</span>
                                    </div>
                                </div>

                                <div className="plan-footer">
                                    <button className="choose-btn" onClick={handleChooseClick}>
                                        Choose Plan <span className="arrow">→</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="nav-arrow right-arrow" onClick={scrollRight}>
                        &#8250;
                    </button>
                </div>
            </div>
        </section>
    );
};

export default InvestmentPlans;
