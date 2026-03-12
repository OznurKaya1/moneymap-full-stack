import React, { useState, useEffect } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/authService"; // get logged-in user

export default function Expenses({ expenseList, setExpenseList, totalBalance }) {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();

  // Fetch expenses safely from backend
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const user = getCurrentUser(); // get logged-in user
        if (!user) { setError("User not logged in."); return; }

        // Use query param if backend expects ?userId=
        const res = await fetch(`http://localhost:8080/api/expenses/${user.id}`);
        if (!res.ok) throw new Error(`Failed to load expenses (${res.status})`);
        const data = await res.json();
        setExpenseList(data); // populate expenseList
      } catch (err) {
        console.error(err);
        setError("Failed to load expenses. Check console for details.");
      }
    }
    fetchExpenses();
  }, [setExpenseList]);

  // Filter by month
  const filteredExpense = selectedMonth
    ? expenseList.filter(item => item.date?.slice(0, 7) === selectedMonth)
    : expenseList;

  // Add or update expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError("");

    if (!date) { setError("Please enter a date."); return; }
    if (!amount) { setError("Please enter an amount."); return; }
    if (Number(amount) < 0) { setError("Amount can't be less than zero."); return; }

    const user = getCurrentUser();
    if (!user) { setError("User not logged in."); return; }

    const newExpense = { date, amount: Number(amount), description };

    // Check total balance
    const currentTotal = expenseList.reduce((sum, item) => sum + item.amount, 0);
    if (currentTotal + Number(amount) > totalBalance) {
      setError("Cannot add: total expenses would exceed your total income!");
      return;
    }

    try {
      if (editingIndex === null) {
        // POST new expense
        const res = await fetch(`http://localhost:8080/api/expenses/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newExpense),
        });
        if (!res.ok) throw new Error(`Failed to save expense (${res.status})`);
        const savedExpense = await res.json();
        setExpenseList([...expenseList, savedExpense]);
      } else {
        // PUT update expense
        const expenseToUpdate = expenseList[editingIndex];
        const res = await fetch(`http://localhost:8080/api/expenses/${expenseToUpdate.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newExpense),
        });
        if (!res.ok) throw new Error(`Failed to update expense (${res.status})`);
        const updatedExpense = await res.json();
        const updatedList = expenseList.map((item, idx) =>
          idx === editingIndex ? updatedExpense : item
        );
        setExpenseList(updatedList);
        setEditingIndex(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save expense. Check console for details.");
    }

    // Reset form
    setDate(""); setAmount(""); setDescription("");
  };

  // Delete expense safely
  const handleRemove = async (i) => {
    const expenseToDelete = filteredExpense[i];
    if (!expenseToDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/expenses/${expenseToDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
      setExpenseList(expenseList.filter(item => item.id !== expenseToDelete.id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete expense.");
    }
  };

  // Edit expense: populate form
  const handleEdit = (i) => {
    const item = filteredExpense[i];
    if (!item) return;
    setDate(item.date); setAmount(item.amount); setDescription(item.description);
    const indexInOriginal = expenseList.findIndex(e => e.id === item.id);
    setEditingIndex(indexInOriginal);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleAddExpense(e); }
  };

  // Calculate totals
  const totalExpense = filteredExpense.reduce((sum, item) => sum + item.amount, 0);

  // Generate month filter
  const monthOptions = Array.from(new Set(expenseList.map(item => item.date?.slice(0, 7)))).sort();

  return (
    <div className="tracker-page">
      <h1 className="tracker-title">Expense Tracker</h1>

      <div className="tracker-card">
        {/* Month filter */}
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
            <input type="date" className="tracker-input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <input type="number" className="tracker-input tracker-input-amount" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} onKeyDown={handleKeyDown} />
          <input type="text" className="tracker-input tracker-input-desc" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} onKeyDown={handleKeyDown} />
        </div>

        <div className="tracker-btn-row">
          <button className="tracker-btn tracker-btn-primary" onClick={handleAddExpense}>
            {editingIndex !== null ? "Update Expense" : "Add Expense"}
          </button>
          <button className="tracker-btn tracker-btn-secondary" onClick={() => navigate("/income")}>
            Go to Income Page
          </button>
          <button className="tracker-btn tracker-btn-secondary" onClick={() => navigate("/summary")}>
            View Summary
          </button>
        </div>

        <p className="tracker-balance-note">
          Remaining budget:{" "}
          <strong>
            {(totalBalance - expenseList.reduce((s, i) => s + i.amount, 0)).toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </strong>
        </p>

        <hr className="tracker-divider" />

        {/* Table */}
        <table className="tracker-table">
          <caption className="tracker-caption">My monthly expenses</caption>
          <thead>
            <tr><th>Date</th><th>Amount</th><th>Description</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filteredExpense.map((item, index) => (
              <tr key={item.id}>
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
              <th colSpan="3">{totalExpense.toLocaleString("en-US", { style: "currency", currency: "USD" })}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}