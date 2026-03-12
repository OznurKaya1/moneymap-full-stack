import React, { useState } from "react";
import { Routes, Route } from "react-router-dom"
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Dashboard from "./components/Dashboard";
import Income from "./components/Tracking/Income";
import Expenses from "./components/Tracking/Expenses";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Pages/Home";
import About from "./components/Pages/About";
import Contact from "./components/Pages/Contact";
import ForgotMyPassword from "./components/ForgotMyPassword";
import TrackingCard from "./components/Pages/TrackingCard";
import SavingGoalsCard from './components/Pages/SavingGoalsCard'
import ExpenseSummary from "./components/Tracking/ExpenseSummary";

import './App.css'

export default function App() {
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [savingsList, setSavingsList] = useState([]);


  const totalExpenses = expenseList.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = incomeList.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgotmypassword" element={<ForgotMyPassword />} />
        <Route path="/trackingcard" element={<TrackingCard />} />
        <Route path="/savinggoalscard" element={<SavingGoalsCard />} />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              incomeList={incomeList}
              expenseList={expenseList}
              savingsList={savingsList}
            />
          }
        />
        <Route
          path="/income"
          element={<Income incomeList={incomeList} setIncomeList={setIncomeList} />}
        />

        <Route
          path="/expenses"
          element={
            <Expenses
              expenseList={expenseList}
              setExpenseList={setExpenseList}
              totalBalance={totalBalance}
            />
          }
        />
        <Route path="/summary" element={<ExpenseSummary expenseList={expenseList} />} />
      </Routes>

      <Footer />
    </div>
  );
}
