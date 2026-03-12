import React, { useState, useEffect } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/authService"; // Get logged-in user

// Income tracker component
export default function Income({ incomeList, setIncomeList }) {
  const [date, setDate] = useState("");               // Form date
  const [amount, setAmount] = useState("");           // Form amount
  const [description, setDescription] = useState(""); // Form description
  const [editingIndex, setEditingIndex] = useState(null); // Editing row index
  const [error, setError] = useState("");             // Validation errors
  const [selectedMonth, setSelectedMonth] = useState(""); // Month filter

  const navigate = useNavigate();

  // Load incomes from backend on mount
  useEffect(() => {
    async function fetchIncomes() {
      try {
        const user = getCurrentUser();
        if (!user) return;
        const res = await fetch(`http://localhost:8080/api/incomes`);
        const data = await res.json();
        setIncomeList(data);
      } catch (err) {
        console.error("Failed to fetch incomes:", err);
      }
    }
    fetchIncomes();
  }, [setIncomeList]);

  // Filter incomes by selected month
  const filteredIncome = selectedMonth
    ? incomeList.filter((item) => item.date && item.date.slice(0, 7) === selectedMonth)
    : incomeList;

  // Add or update income
  const handleAddIncome = async (e) => {
    e.preventDefault();
    setError("");

    if (!date) { setError("Enter date"); return; }
    if (!amount) { setError("Enter amount"); return; }

    const user = getCurrentUser();
    if (!user) { setError("User not logged in"); return; }

    const newIncome = { date, amount: Number(amount), description };

    try {
      let savedIncome;
      if (editingIndex === null) {
        // POST new income to backend
        const res = await fetch(`http://localhost:8080/api/incomes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newIncome),
        });
        savedIncome = await res.json();
        setIncomeList([...incomeList, savedIncome]);
      } else {
        // PUT update existing income
        const incomeToUpdate = incomeList[editingIndex];
        const res = await fetch(`http://localhost:8080/api/incomes/${incomeToUpdate.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newIncome),
        });
        savedIncome = await res.json();
        const updatedList = incomeList.map((item, idx) => idx === editingIndex ? savedIncome : item);
        setIncomeList(updatedList);
        setEditingIndex(null);
      }
    } catch (err) {
      console.error("Failed to save income:", err);
      setError("Failed to save income.");
    }

    setDate(""); setAmount(""); setDescription("");
  };

  // Delete income
  const handleRemoveIncome = async (i) => {
    try {
      const incomeToDelete = filteredIncome[i];
      await fetch(`http://localhost:8080/api/incomes/${incomeToDelete.id}`, { method: "DELETE" });
      setIncomeList(incomeList.filter(item => item.id !== incomeToDelete.id));
    } catch (err) {
      console.error("Failed to delete income:", err);
      setError("Failed to delete income.");
    }
  };

  // Load income into form for editing
  const handleEditIncome = (i) => {
    const item = filteredIncome[i];
    setDate(item.date); setAmount(item.amount); setDescription(item.description);
    const indexInOriginal = incomeList.findIndex(e => e.id === item.id);
    setEditingIndex(indexInOriginal);
  };

  const totalAmount = filteredIncome.reduce((sum, item) => sum + item.amount, 0); // Total filtered incomes
  const monthOptions = Array.from(new Set(incomeList.map(item => item.date && item.date.slice(0, 7)))).sort(); // Months

  return (
    <div className="tracker-page">
      <h1 className="tracker-title">Income Tracker</h1>

      <div className="tracker-card">
        {/* Month filter */}
        <div className="tracker-filter">
          <label htmlFor="monthSelect">Filter by Month:</label>
          <select id="monthSelect" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="">All Months</option>
            {monthOptions.map(month => (
              <option key={month} value={month}>
                {new Date(month + "-01").toLocaleString("default", { month: "long", year: "numeric" })}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && <p className="tracker-error">{error}</p>}

        {/* Form */}
        <div className="tracker-form-row">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Buttons */}
        <div className="tracker-btn-row">
          <button className="tracker-btn tracker-btn-primary" onClick={handleAddIncome}>
            {editingIndex !== null ? "Update Income" : "Add Income"}
          </button>
          <button className="tracker-btn tracker-btn-secondary" onClick={() => navigate("/expenses")}>
            Go to Expenses
          </button>
        </div>

        {/* Table */}
        <table className="tracker-table">
          <thead>
            <tr><th>Date</th><th>Amount</th><th>Description</th><th>Action</th></tr>
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
      </div>
    </div>
  );
}