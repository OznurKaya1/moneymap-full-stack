import React, { useState, useEffect } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../services/authService";

export default function Income({ incomeList, setIncomeList }) {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Fetch incomes for the logged-in user
  useEffect(() => {
    async function fetchIncomes() {
      try {
        const user = getCurrentUser();
        if (!user) { setError("User not logged in."); return; }

        const res = await fetch(`http://localhost:8080/api/incomes/${user.id}`);
        if (!res.ok) throw new Error(`Server is not responding. Please try again later. (${res.status})`);
        const data = await res.json();
        setIncomeList(data);
      } catch (err) {
        console.error(err);
        setError("Server is not responding. Please try again later.");
      }
    }
    fetchIncomes();
  }, [setIncomeList]);

  // Filter by month
  const filteredIncome = selectedMonth
    ? incomeList.filter(item => item.date?.slice(0, 7) === selectedMonth)
    : incomeList;

  const handleAddIncome = async (e) => {
    e.preventDefault();
    setError("");
    if (!date) { setError("Please enter a date."); return; }
    if (!amount) { setError("Please enter an amount."); return; }

    const user = getCurrentUser();
    if (!user) { setError("User not logged in."); return; }

    const newIncome = { date, amount: Number(amount), description };

    try {
      if (editingIndex === null) {
        const res = await fetch(`http://localhost:8080/api/incomes/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newIncome),
        });

        if (!res.ok) throw new Error(`Server is not responding. Please try again later. (${res.status})`);

        const savedIncome = await res.json();
        setIncomeList([...incomeList, savedIncome]);
      } else {
        const incomeToUpdate = incomeList[editingIndex];
        const res = await fetch(
          `http://localhost:8080/api/incomes/${user.id}/${incomeToUpdate.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newIncome),
          }
        );

        if (!res.ok) throw new Error(`Server is not responding. Please try again later. (${res.status})`);

        const updatedIncome = await res.json();
        const updatedList = incomeList.map((item, idx) =>
          idx === editingIndex ? updatedIncome : item
        );
        setIncomeList(updatedList);
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

  // Delete income
  const handleRemoveIncome = async (i) => {
    const incomeToDelete = filteredIncome[i];
    if (!incomeToDelete) return;

    const user = getCurrentUser();
    if (!user) { setError("User not logged in."); return; }

    try {
      const res = await fetch(`http://localhost:8080/api/incomes/${user.id}/${incomeToDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Server is not responding. Please try again later. (${res.status})`);
      setIncomeList(incomeList.filter(item => item.id !== incomeToDelete.id));
    } catch (err) {
      console.error(err);
      setError("Server is not responding. Please try again later.");
    }
  };

  // Edit income
  const handleEditIncome = (i) => {
    const item = filteredIncome[i];
    if (!item) return;

    setDate(item.date);
    setAmount(item.amount);
    setDescription(item.description);

    const indexInOriginal = incomeList.findIndex(e => e.id === item.id);
    setEditingIndex(indexInOriginal);
  };

  const monthOptions = Array.from(new Set(incomeList.map(item => item.date?.slice(0, 7)))).sort();
  const totalAmount = filteredIncome.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="tracker-page">
      <h1 className="tracker-title">Income Tracker</h1>

      <div className="tracker-card">

        <div className="tracker-filter">
          <label htmlFor="monthSelect">Filter by Month:</label>
          <select
            id="monthSelect"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {monthOptions.map(month => (
              <option key={month} value={month}>
                {new Date(month + "-01T00:00:00").toLocaleString("en-US", { month: "long", year: "numeric" })}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="tracker-error">{error}</p>}

        <div className="tracker-form-row">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="tracker-btn-row">
          <button className="tracker-btn tracker-btn-primary" onClick={handleAddIncome}>
            {editingIndex !== null ? "Update Income" : "Add Income"}
          </button>
          <button className="tracker-btn tracker-btn-secondary" onClick={() => navigate("/expenses")}>
            Go to Expenses
          </button>
        </div>

        <table className="tracker-table">
          <thead>
            <tr>
              <th>Date</th><th>Amount</th><th>Description</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncome.map((item, index) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                <td>{item.description}</td>
                <td className="tracker-actions">
                  <BsFillTrashFill onClick={() => handleRemoveIncome(index)} />
                  <BsFillPencilFill onClick={() => handleEditIncome(index)} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th colSpan="3">{totalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</th>
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