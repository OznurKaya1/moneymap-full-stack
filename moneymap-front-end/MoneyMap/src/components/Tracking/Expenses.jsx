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

  // Filter expenses by selected month
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
    const currentTotalExpense = expenseList.reduce((sum, item) => sum + item.amount, 0);

    if (currentTotalExpense + Number(amount) > totalBalance) {
      setError("Cannot add this expense: total expenses would exceed your total income!");
      return;
    }

    if (editingIndex === null) {
      setExpenseList([...expenseList, newExpense]);
    } else {
      const updatedList = expenseList.map((item, idx) =>
        idx === editingIndex ? newExpense : item
      );
      setExpenseList(updatedList);
      setEditingIndex(null);
    }

    setDate("");
    setAmount("");
    setDescription("");
  };

  const handleRemove = (index) => {
    setExpenseList(expenseList.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const item = expenseList[index];
    setDate(item.date);
    setAmount(item.amount);
    setDescription(item.description);
    setEditingIndex(index);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddExpense(e);
    }
  };

  const totalExpense = filteredExpense.reduce((sum, item) => sum + item.amount, 0);

  // Generate month options dynamically from expenseList
  const monthOptions = Array.from(new Set(
    expenseList.map(item => item.date.slice(0, 7))
  )).sort();

  return (
    <div className="main-container-table">
      <section>
        <form>
          {error && <p style={{ color: 'red' }}>{error}</p>}

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

          <button type="button" className="btn" onClick={handleAddExpense}>
            {editingIndex !== null ? "Update" : "Add"}
          </button>
          <button type="button" className="btn" onClick={() => navigate('/income')}>
            Go to Income Page
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

      <table id="expense-board">
        <caption>My monthly expenses</caption>
        <thead>
          <tr>
            <th className="date">Date</th>
            <th className="amount">Amount</th>
            <th className="expand">Description</th>
            <th className="action">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpense.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
              <td>{item.description}</td>
              <td className="action-buttons">
                <BsFillTrashFill onClick={() => handleRemove(index)} />
                <BsFillPencilFill onClick={() => handleEdit(index)} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Total Expenses</th>
            <th>{totalExpense.toLocaleString("en-US", { style: "currency", currency: "USD" })}</th>
            <th></th>
          </tr>
        </tfoot>
      </table>

      <h3>
        You have {totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} to spend!
      </h3>
    </div>
  );
}