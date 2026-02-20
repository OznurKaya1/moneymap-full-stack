import React from 'react';
import saving from '../Images/saving.jpg'
import { useNavigate } from 'react-router';


export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      
     
      <section className="hero">
        <h1 className="hero-title">MoneyMap</h1>
        <h3 className="hero-subtitle">Visualize. Plan. Grow.</h3>
        <p className="hero-text">
          Take control of your finances and see exactly where your money goes. MoneyMap
          helps you organize your income, expenses, and savings in a simple, clear way.
        </p>
      </section>

   
      <section className="features">
        <div className="feature-card"
        onClick={() => navigate('/trackingcard')} >
            
          <h4>Track Income & Expenses</h4>
          <p>See every transaction in one place and understand your spending habits.</p>
        </div>
        <div className="feature-card"
        onClick={() => navigate('/savinggoalscard')} >
          
          <h4>Set Savings Goals</h4>
          <p>Create goals and build realistic budget that fit your lifestyle witout stress.</p>
        </div>
       
      </section>
      
      <section className="visuals">
        <img src={saving} alt="Saving" className="saving-image" />
        <h3 className="visual-text">
          <em>Understand your finances visually. Track your income, expenses, and savings over time.</em>
        </h3>
      </section>
    </main>
  );
}
