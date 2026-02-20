import React from 'react'
import income from './Images/income.jpg'
import expense from './Images/expense.jpg'
import DashboardCard from './DashboardCard'

export default function Dashboard() {
  return (
    <div className='dashboard-container'>
      <h2>Take control of your money</h2>

      <div className="dashboard-links">
        <DashboardCard
          to="/income"
          label="My Income"
          img={income}
          alt="income"
        />
        <DashboardCard
          to="/expenses"
          label="My Expenses"
          img={expense}
          alt="expense"
        />
      </div>
    </div>
  )
}
