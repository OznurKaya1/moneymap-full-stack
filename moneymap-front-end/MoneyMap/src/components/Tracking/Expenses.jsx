import React, { useState, useEffect } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../services/authService";

export default function Expenses({ expenseList, setExpenseList, totalBalance }) {

  // Form state
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Editing state
  const [editingIndex, setEditingIndex] = useState(null);

  // UI state
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const navigate = useNavigate();

  // Logout user and return to home page
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Fetch expenses belonging to the logged-in user
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const user = getCurrentUser();
        if (!user) { setError("User not logged in."); return; }

        const res = await fetch(`http://localhost:8080/api/expenses/${user.id}`);
        if (!res.ok) throw new Error(`Server is not responding. Please try again later. (${res.status})`);

        const data = await res.json();
        setExpenseList(data);

      } catch (err) {
        console.error(err);
        setError("Server is not responding. Please try again later.");
      }
    }

    fetchExpenses();
  }, [setExpenseList]);

  // Filter expenses by selected month
  const filteredExpense = selectedMonth
    ? expenseList.filter(item => item.date?.slice(0, 7) === selectedMonth)
    : expenseList;

  // Total Expense for the selected month
  const totalExpense = filteredExpense.reduce((sum, item) => sum + item.amount, 0);

  // Remaining budget
  const remainingBudget = totalBalance;

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

    try {

      if (editingIndex === null) {

        const res = await fetch(`http://localhost:8080/api/expenses/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newExpense),
        });

        if (!res.ok) throw new Error(`Server is not responding. Please try again later. (${res.status})`);

        const savedExpense = await res.json();
        setExpenseList([...expenseList, savedExpense]);

      } else {

        const expenseToUpdate = expenseList[editingIndex];

        const res = await fetch(
          `http://localhost:8080/api/expenses/${user.id}/${expenseToUpdate.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExpense),
          }
        );

        if (!res.ok) throw new Error(`Server is not responding. Please try again later.(${res.status})`);

        const updatedExpense = await res.json();

        const updatedList = expenseList.map((item, idx) =>
          idx === editingIndex ? updatedExpense : item
        );

        setExpenseList(updatedList);
        setEditingIndex(null);
      }

    } catch (err) {
      console.error(err);
      setError("Server is not responding. Please try again later.");
    }

    setDate("");
    setAmount("");
    setDescription("");
  };

  // Delete expense entry
  const handleRemove = async (i) => {

    const expenseToDelete = filteredExpense[i];
    if (!expenseToDelete) return;

    const user = getCurrentUser();
    if (!user) { setError("User not logged in."); return; }

    try {

      const res = await fetch(
        `http://localhost:8080/api/expenses/${user.id}/${expenseToDelete.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error(` Server is not responding. Please try again later.(${res.status})`);

      setExpenseList(
        expenseList.filter(item => item.id !== expenseToDelete.id)
      );

    } catch (err) {
      console.error(err);
      setError("Server is not responding. Please try again later.");
    }
  };

  // Load expense values into form for editing
  const handleEdit = (i) => {

    const item = filteredExpense[i];
    if (!item) return;

    setDate(item.date);
    setAmount(item.amount);
    setDescription(item.description);

    const indexInOriginal = expenseList.findIndex(e => e.id === item.id);
    setEditingIndex(indexInOriginal);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddExpense(e);
    }
  };

  const monthOptions = Array.from(
    new Set(expenseList.map(item => item.date?.slice(0, 7)))
  ).sort();

  return (
    <div className="tracker-page">

      <h1 className="tracker-title">Expense Tracker</h1>

      <div className="tracker-card">

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
                {new Date(month + "-01T00:00:00")
                  .toLocaleString("en-US", { month: "long", year: "numeric" })}
              </option>
            ))}

          </select>
        </div>

        <hr className="tracker-divider" />

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

          <button
            className="tracker-btn tracker-btn-primary"
            onClick={handleAddExpense}
          >
            {editingIndex !== null ? "Update Expense" : "Add Expense"}
          </button>

          <button
            className="tracker-btn tracker-btn-secondary"
            onClick={() => navigate("/income")}
          >
            Go to Income Page
          </button>

          <button
            className="tracker-btn tracker-btn-secondary"
            onClick={() => navigate("/summary")}
          >
            View Summary
          </button>

        </div>

        <p className="tracker-balance-note">
          Remaining budget:{" "}
          <strong style={{ color: remainingBudget < 0 ? "red" : "inherit" }}>
            {remainingBudget.toLocaleString("en-US", {
              style: "currency",
              currency: "USD"
            })}
          </strong>
        </p>

        <hr className="tracker-divider" />

        <table className="tracker-table">

          <caption className="tracker-caption">
            My monthly expenses
          </caption>

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

              <tr key={item.id}>

                <td>{item.date}</td>

                <td>
                  {item.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD"
                  })}
                </td>

                <td>{item.description}</td>

                <td className="tracker-actions">

                  <BsFillTrashFill
                    className="action-icon trash"
                    onClick={() => handleRemove(index)}
                  />

                  <BsFillPencilFill
                    className="action-icon edit"
                    onClick={() => handleEdit(index)}
                  />

                </td>

              </tr>

            ))}

          </tbody>

          <tfoot>
            <tr>
              <th>Total Expenses</th>
              <th colSpan="3">
                {totalExpense.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD"
                })}
              </th>
            </tr>
          </tfoot>

        </table>

        {/* Login / Logout button */}
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          {getCurrentUser() ? (
            <button className="tracker-btn tracker-btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="tracker-btn tracker-btn-secondary" onClick={() => window.location.href = "/"}>
              Login
            </button>
          )}
        </div>

      </div>

    </div>
  );
}