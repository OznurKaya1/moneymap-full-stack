import React, { useState } from "react";
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

  const filteredIncome = selectedMonth
    ? incomeList.filter((item) => item.date.slice(0, 7) === selectedMonth)
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
      const updatedList = incomeList.map((item, idx) =>
        idx === editingIndex ? newIncome : item
      );
      setIncomeList(updatedList);
      setEditingIndex(null);
    }
    setDate(""); setAmount(""); setDescription("");
  };

  const handleRemoveIncome = (i) => setIncomeList(incomeList.filter((_, idx) => idx !== i));

  const handleEditIncome = (i) => {
    const item = incomeList[i];
    setDate(item.date); setAmount(item.amount); setDescription(item.description);
    setEditingIndex(i);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleAddIncome(e); }
  };

  const totalAmount = filteredIncome.reduce((sum, item) => sum + item.amount, 0);

  const monthOptions = Array.from(new Set(incomeList.map(item => item.date.slice(0, 7)))).sort();

  return (
    <div className="tracker-page">
      <h1 className="tracker-title">Income Tracker</h1>

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
          <button className="tracker-btn tracker-btn-primary" onClick={handleAddIncome}>
            {editingIndex !== null ? "Update Income" : "Add Income"}
          </button>
          <button className="tracker-btn tracker-btn-secondary" onClick={() => navigate("/expenses")}>
            Go to Expenses
          </button>
        </div>

        <hr className="tracker-divider" />

        {/* Table */}
        <table className="tracker-table">
          <caption className="tracker-caption">My monthly income</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncome.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                <td>{item.description}</td>
                <td className="tracker-actions">
                  <BsFillTrashFill className="action-icon trash" onClick={() => handleRemoveIncome(index)} />
                  <BsFillPencilFill className="action-icon edit" onClick={() => handleEditIncome(index)} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Balance</th>
              <th colSpan="3">
                {totalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}