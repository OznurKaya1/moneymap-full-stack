import React, { useState } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function Expenses({ expenseList, setExpenseList, totalBalance }) {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();

  const filteredExpense = selectedMonth
    ? expenseList.filter((item) => item.date.slice(0, 7) === selectedMonth)
    : expenseList;

  const handleAddExpense = (e) => {
    e.preventDefault();
    setError("");
    if (!date) { setError("Please enter a date."); return; }
    if (!amount) { setError("Please enter an amount."); return; }
    if (Number(amount) < 0) { setError("Amount can't be less than zero."); return; }

    const newExpense = { date, amount: Number(amount), description };
    const currentTotal = expenseList.reduce((sum, item) => sum + item.amount, 0);

    if (currentTotal + Number(amount) > totalBalance) {
      setError("Cannot add: total expenses would exceed your total income!");
      return;
    }

    if (editingIndex === null) {
      setExpenseList([...expenseList, newExpense]);
    } else {
      const updated = expenseList.map((item, idx) =>
        idx === editingIndex ? newExpense : item
      );
      setExpenseList(updated);
      setEditingIndex(null);
    }
    setDate(""); setAmount(""); setDescription("");
  };

  const handleRemove = (i) => setExpenseList(expenseList.filter((_, idx) => idx !== i));

  const handleEdit = (i) => {
    const item = expenseList[i];
    setDate(item.date); setAmount(item.amount); setDescription(item.description);
    setEditingIndex(i);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleAddExpense(e); }
  };

  const totalExpense = filteredExpense.reduce((sum, item) => sum + item.amount, 0);

  const monthOptions = Array.from(new Set(expenseList.map(item => item.date.slice(0, 7)))).sort();

  return (
    <div className="tracker-page">
      <h1 className="tracker-title">Expense Tracker</h1>

      <div className="tracker-card">
        {/* Month Filter */}
        <div className="tracker-filter">
          <label htmlFor="monthSelect">Filter by Month:</label>
          <select
            id="monthSelect"
            className="tracker-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {new Date(month + "-01").toLocaleString("default", { month: "long", year: "numeric" })}
              </option>
            ))}
          </select>
        </div>

        <hr className="tracker-divider" />

        {/* Form */}
        {error && <p className="tracker-error">{error}</p>}
        <div className="tracker-form-row">
          <div className="tracker-field">
            <span className="tracker-field-label">Date</span>
            <input
              type="date"
              className="tracker-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <input
            type="number"
            className="tracker-input tracker-input-amount"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="text"
            className="tracker-input tracker-input-desc"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="tracker-btn-row">
          <button className="tracker-btn tracker-btn-primary" onClick={handleAddExpense}>
            {editingIndex !== null ? "Update Expense" : "Add Expense"}
          </button>
          <button className="tracker-btn tracker-btn-secondary" onClick={() => navigate("/income")}>
            Go to Income Page
          </button>
        </div>

        <p className="tracker-balance-note">
          Remaining budget:{" "}
          <strong>
            {(totalBalance - expenseList.reduce((s, i) => s + i.amount, 0)).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </strong>
        </p>

        <hr className="tracker-divider" />

        {/* Table */}
        <table className="tracker-table">
          <caption className="tracker-caption">My monthly expenses</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpense.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                <td>{item.description}</td>
                <td className="tracker-actions">
                  <BsFillTrashFill className="action-icon trash" onClick={() => handleRemove(index)} />
                  <BsFillPencilFill className="action-icon edit" onClick={() => handleEdit(index)} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Total Expenses</th>
              <th colSpan="3">
                {totalExpense.toLocaleString("en-US", { style: "currency", currency: "USD" })}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}