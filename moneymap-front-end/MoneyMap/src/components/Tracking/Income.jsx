import React, { useState, useEffect } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function Income({ incomeList, setIncomeList }) {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();

  // Filter income by selected month
  const filteredIncome = selectedMonth
    ? incomeList.filter(
        (incomeItem) => incomeItem.date.slice(0, 7) === selectedMonth
      )
    : incomeList;

  const handleAddIncome = (e) => {
    e.preventDefault();
    setError("");

    if (!date) { setError("Please enter a date."); return; }
    if (!amount) { setError("Please enter an amount."); return; }
    if (Number(amount) < 0) { setError("Amount can't be less than zero."); return; }

    const newIncome = { date, amount: Number(amount), description };

    if (editingIndex === null) {
      setIncomeList([...incomeList, newIncome]);
    } else {
      const updatedIncomeList = incomeList.map((incomeItem, index) =>
        index === editingIndex ? newIncome : incomeItem
      );
      setIncomeList(updatedIncomeList);
      setEditingIndex(null);
    }

    setDate("");
    setAmount("");
    setDescription("");
  };

  const handleRemoveIncome = (indexToRemove) => {
    setIncomeList(incomeList.filter((_, index) => index !== indexToRemove));
  };

  const handleEditIncome = (indexToEdit) => {
    const incomeItem = incomeList[indexToEdit];
    setDate(incomeItem.date);
    setAmount(incomeItem.amount);
    setDescription(incomeItem.description);
    setEditingIndex(indexToEdit);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIncome(e);
    }
  };

  const totalAmount = filteredIncome.reduce((sum, incomeItem) => sum + incomeItem.amount, 0);

  // Generate month options dynamically from incomeList
  const monthOptions = Array.from(new Set(
    incomeList.map(item => item.date.slice(0, 7))
  )).sort();

  return (
    <div className='main-container-table'>
      <section>
        <form>
          {error && <p className="error">{error}</p>}

          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button type="button" className="btn" onClick={handleAddIncome}>
            {editingIndex !== null ? "Update" : "Add"}
          </button>

          <button type="button" className="btn" onClick={() => navigate('/expenses')}>
            Go to Expenses
          </button>
        </form>

        {/* Month filter dropdown */}
        {monthOptions.length > 0 && (
          <div className="month-filter">
            <label htmlFor="monthSelect">Filter by Month: </label>
            <select
              id="monthSelect"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {new Date(month + "-01").toLocaleString('default', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      <table id='income-board'>
        <caption>My monthly income</caption>
        <thead>
          <tr>
            <th className="date">Date</th>
            <th className="amount">Amount</th>
            <th className='expand'>Description</th>
            <th className="action">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncome.map((incomeItem, index) => (
            <tr key={index}>
              <td>{incomeItem.date}</td>
              <td>{incomeItem.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
              <td>{incomeItem.description}</td>
              <td className="action-buttons">
                <BsFillTrashFill
                  onClick={() => handleRemoveIncome(index)}
                />
                <BsFillPencilFill
                  onClick={() => handleEditIncome(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <th>{totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}