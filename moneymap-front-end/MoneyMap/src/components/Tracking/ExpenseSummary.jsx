import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import {
  Chart,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  DoughnutController,
  BarController,
} from "chart.js";

Chart.register(ArcElement, Tooltip, CategoryScale, LinearScale, BarElement, DoughnutController, BarController);

const COLORS = ["#378ADD","#1D9E75","#D85A30","#BA7517","#7F77DD","#D4537E","#639922","#E24B4A"];

export default function ExpenseSummary({ expenseList }) {
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const pieRef = useRef(null);
  const barRef = useRef(null);
  const pieChart = useRef(null);
  const barChart = useRef(null);

  const monthOptions = Array.from(new Set(expenseList.map(item => item.date?.slice(0, 7)))).filter(Boolean).sort();
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[monthOptions.length - 1] || "");

  const filtered = selectedMonth
    ? expenseList.filter(item => item.date?.slice(0, 7) === selectedMonth)
    : expenseList;

  const grouped = filtered.reduce((acc, item) => {
    const key = item.description || "Other";
    acc[key] = (acc[key] || 0) + item.amount;
    return acc;
  }, {});

  const pieLabels = Object.keys(grouped);
  const pieData = Object.values(grouped);
  const total = pieData.reduce((s, v) => s + v, 0);

  const monthlyTotals = monthOptions.map(month => ({
    month,
    total: expenseList.filter(item => item.date?.slice(0, 7) === month).reduce((s, i) => s + i.amount, 0),
  }));

  const formatMonth = m => new Date(m + "-02").toLocaleString("default", { month: "short", year: "numeric" });
  const formatMonthLong = m => new Date(m + "-02").toLocaleString("default", { month: "long", year: "numeric" });

  // Pie chart
  useEffect(() => {
    if (!pieRef.current || !pieLabels.length) return;
    if (pieChart.current) pieChart.current.destroy();

    pieChart.current = new Chart(pieRef.current, {
      type: "doughnut",
      data: {
        labels: pieLabels,
        datasets: [{
          data: pieData,
          backgroundColor: COLORS.slice(0, pieLabels.length),
          borderWidth: 3,
          borderColor: "#ffffff",
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: $${ctx.parsed.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            },
          },
        },
      },
    });

    return () => { if (pieChart.current) pieChart.current.destroy(); };
  }, [selectedMonth, expenseList]);

  // Bar chart
  useEffect(() => {
    if (!barRef.current || !monthlyTotals.length) return;
    if (barChart.current) barChart.current.destroy();

    barChart.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: monthlyTotals.map(m => formatMonth(m.month)),
        datasets: [{
          label: "Total Expenses",
          data: monthlyTotals.map(m => m.total),
          backgroundColor: monthlyTotals.map(m => m.month === selectedMonth ? "#378ADD" : "#B5D4F4"),
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 12 }, autoSkip: false } },
          y: { grid: { color: "#f0f0f0" }, ticks: { font: { size: 12 }, callback: v => "$" + v.toLocaleString() } },
        },
      },
    });

    return () => { if (barChart.current) barChart.current.destroy(); };
  }, [selectedMonth, expenseList]);

  return (
    <div className="tracker-page">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h1 className="tracker-title" style={{ margin: 0 }}>Expense Summary</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="tracker-btn tracker-btn-secondary" onClick={() => navigate(-1)}>← Back to Expenses</button>
          <button className="tracker-btn tracker-btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Month filter */}
      <div className="tracker-card" style={{ marginBottom: "1rem" }}>
        <div className="tracker-filter">
          <label htmlFor="summaryMonth">Filter by Month:</label>
          <select id="summaryMonth" className="tracker-select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            <option value="">All Time</option>
            {monthOptions.map(m => <option key={m} value={m}>{formatMonthLong(m)}</option>)}
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "12px", marginBottom: "1.5rem" }}>
        <div style={metricCard}>
          <p style={metricLabel}>total expenses</p>
          <p style={metricValue}>{total.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
        </div>
        <div style={metricCard}>
          <p style={metricLabel}>categories</p>
          <p style={metricValue}>{pieLabels.length}</p>
        </div>
        <div style={metricCard}>
          <p style={metricLabel}>transactions</p>
          <p style={metricValue}>{filtered.length}</p>
        </div>
      </div>

      {/* Pie chart */}
      {filtered.length > 0 ? (
        <div className="tracker-card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={sectionTitle}>{selectedMonth ? `${formatMonthLong(selectedMonth).toLowerCase()} — breakdown` : "all time — breakdown"}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "1rem" }}>
            {pieLabels.map((label, i) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i], display: "inline-block", flexShrink: 0 }} />
                {label} — {Math.round((grouped[label]/total)*100)}%
              </span>
            ))}
          </div>
          <div style={{ position: "relative", width: "100%", height: "300px" }}>
            <canvas ref={pieRef} />
          </div>
        </div>
      ) : (
        <div className="tracker-card" style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
          No expenses found for this month.
        </div>
      )}

      {/* Bar chart */}
      {monthlyTotals.length > 1 && (
        <div className="tracker-card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={sectionTitle}>monthly overview</h2>
          <div style={{ position: "relative", width: "100%", height: "220px" }}>
            <canvas ref={barRef} />
          </div>
        </div>
      )}

      {/* Entries table */}
      {filtered.length > 0 && (
        <div className="tracker-card">
          <h2 style={sectionTitle}>{selectedMonth ? `${formatMonthLong(selectedMonth).toLowerCase()} — all entries` : "all entries"}</h2>
          <table className="tracker-table">
            <thead><tr><th>Date</th><th>Amount</th><th>Description</th></tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <th colSpan="2">{total.toLocaleString("en-US", { style: "currency", currency: "USD" })}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

// Styles
const metricCard = { background: "var(--color-background-secondary)", borderRadius: "8px", padding: "1rem" };
const metricLabel = { fontSize: "13px", color: "var(--color-text-secondary)", margin: "0 0 4px" };
const metricValue = { fontSize: "22px", fontWeight: 500, margin: 0, color: "var(--color-text-primary)" };
const sectionTitle = { fontSize: "14px", fontWeight: 500, margin: "0 0 1rem", color: "var(--color-text-secondary)", letterSpacing: "0.02em" };