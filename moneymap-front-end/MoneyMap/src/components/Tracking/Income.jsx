import React, { useState } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'

export default function Income({ incomeList, setIncomeList }) {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const navigate = useNavigate();

  const handleAddIncome = (e) => {
    e.preventDefault();
    setError("");

    if (!date) { setError("Please enter date."); return; }
    if (!amount) { setError("Please enter an amount."); return; }
    if (Number(amount) < 0) { setError("Amount can't be less than zero."); return; }

    const newIncome = { date, amount: Number(amount), description };

    if (editingIndex === null) {

      setIncomeList([...incomeList, newIncome]);
    } else {

      const updatedIncomeList = incomeList.map((incomeItem, currentIndex) =>
        currentIndex === editingIndex ? newIncome : incomeItem);
      setIncomeList(updatedIncomeList);
      setEditingIndex(null);
    }


    setDate("");
    setAmount("");
    setDescription("");
  };

  const handleRemoveIncome = (indexToRemove) => {
    setIncomeList(incomeList.filter((incomeItem, currentIndex) => currentIndex !== indexToRemove));
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
      e.preventDefault()
      handleAddIncome(e)
    }
  }

  const totalAmount = incomeList.reduce((sum, incomeItem) => sum + incomeItem.amount, 0);

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
            Add
          </button>

          <button type="button" className="btn" onClick={() => navigate('/expenses')}>
            Go to Expenses
          </button>

        </form>
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
          {incomeList.map((incomeItem, currentIndex) => (
            <tr key={currentIndex}>
              <td>{incomeItem.date}</td>
              <td>{incomeItem.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
              <td>{incomeItem.description}</td>
              <td>
                <span className="action-buttons">
                  <BsFillTrashFill
                    onClick={() => handleRemoveIncome(currentIndex)}
                    style={{ cursor: 'pointer', marginRight: '8px' }}
                  />
                  <BsFillPencilFill
                    onClick={() => handleEditIncome(currentIndex)}
                    style={{ cursor: 'pointer' }}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Balance</th>
            <th>{totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
            <th></th>
          </tr>
        </tfoot>
      </table>

    </div>

  );
}
