import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dollar from '../Images/dollar.jpg';

export default function About() {
  const navigate = useNavigate();

  return (
    <main className="about-page">

    
      <section className="about-intro">
        <h1>Welcome to MoneyMap</h1>
        <p>
          At MoneyMap, we believe that understanding your finances shouldn’t require a finance degree.  
          Too often, managing money feels overwhelming — juggling bills, tracking expenses, and trying to figure out where your paycheck really goes.
        </p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          MoneyMap gives you a complete picture of your income, expenses, and savings in one intuitive dashboard.  
          Our goal is to help you see patterns, spot opportunities, and take control of your financial future.
        </p>
      </section>

      <section className="about-philosophy">
        <h2>Our Philosophy</h2>
        <p>
          We know that everyone’s financial journey is unique. That’s why MoneyMap is flexible: you can customize categories, set goals that fit your lifestyle, and visualize progress at your own pace.  
          Behind MoneyMap is a small team of people who care deeply about making finance simple and accessible for everyone.
        </p>
      </section>

     
      <section className="about-visual">
        <img src={Dollar} alt="Dollar" className="dollar-image" />
      </section>

    
      <section className="about-conclusion">
        <p>
          MoneyMap is more than just a budgeting app — it’s your guide to financial confidence.  
          We’re here to help you make informed choices, stay organized, and build the financial foundation for the life you want.
        </p>
        <button
          type="button"
          className="btn"
          onClick={() => navigate('/Dashboard')}
        >
          Go to Dashboard
        </button>
      </section>

    </main>
  );
}
