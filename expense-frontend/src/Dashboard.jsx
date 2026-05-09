import { useState, useEffect } from "react";
import axios from "axios";
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const COLORS = ["#ef4444", "#3b82f6", "#a855f7", "#f59e0b", "#10b981", "#ec4899", "#6b7280"];

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/expenses")
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const monthMap = {};
  expenses.forEach((e) => {
    const month = e.date ? e.date.substring(0, 7) : "Unknown";
    monthMap[month] = (monthMap[month] || 0) + e.amount;
  });
  const sortedMonths = Object.keys(monthMap).sort();

  const highestCategory = Object.entries(categoryMap).reduce(
    (max, [name, value]) => value > max.value ? { name, value } : max,
    { name: "-", value: 0 }
  );

  const pieData = {
    labels: Object.keys(categoryMap),
    datasets: [{
      data: Object.values(categoryMap),
      backgroundColor: COLORS,
      borderWidth: 0,
    }]
  };

  const barData = {
    labels: sortedMonths,
    datasets: [{
      label: "Amount (₹)",
      data: sortedMonths.map((m) => monthMap[m]),
      backgroundColor: COLORS,
      borderRadius: 8,
    }]
  };

  if (loading) return <p style={{ textAlign: "center", color: "#aaa", marginTop: "50px" }}>Loading...</p>;

  const cards = [
    { label: "Total Expenses", value: `₹${total.toFixed(2)}`, color: "#a855f7" },
    { label: "Transactions", value: expenses.length, color: "#06b6d4" },
    { label: "Highest Category", value: highestCategory.name, sub: `₹${highestCategory.value.toFixed(2)}`, color: "#f59e0b" },
    { label: "Avg per Transaction", value: `₹${expenses.length > 0 ? (total / expenses.length).toFixed(2) : "0.00"}`, color: "#10b981" },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "28px",
        fontWeight: "900",
        background: "linear-gradient(90deg, #a855f7, #06b6d4, #10b981)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        Dashboard 📊
      </h2>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
        {cards.map((card) => (
          <div key={card.label} style={{
            flex: 1,
            minWidth: "200px",
            background: `${card.color}11`,
            borderRadius: "20px",
            padding: "24px",
            textAlign: "center",
            border: `1px solid ${card.color}33`,
            boxShadow: `0 4px 20px ${card.color}22`,
          }}>
            <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "1px" }}>{card.label}</p>
            <p style={{ color: card.color, fontSize: "26px", fontWeight: "900", margin: "0 0 4px" }}>{card.value}</p>
            {card.sub && <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div style={{
          flex: 1,
          minWidth: "300px",
          background: "rgba(168,85,247,0.05)",
          borderRadius: "20px",
          padding: "24px",
          border: "1px solid #a855f722",
        }}>
          <h3 style={{ color: "#a855f7", fontSize: "16px", marginTop: 0, marginBottom: "16px", fontWeight: "700" }}>
            🥧 Spending by Category
          </h3>
          {Object.keys(categoryMap).length === 0 ? (
            <p style={{ color: "#aaa", textAlign: "center" }}>No data</p>
          ) : (
            <Pie data={pieData} options={{
              plugins: {
                legend: { labels: { color: "#aaa" } },
                tooltip: { backgroundColor: "#1a1a2e", borderColor: "#a855f744", borderWidth: 1 }
              }
            }} />
          )}
        </div>

        <div style={{
          flex: 1,
          minWidth: "300px",
          background: "rgba(6,182,212,0.05)",
          borderRadius: "20px",
          padding: "24px",
          border: "1px solid #06b6d422",
        }}>
          <h3 style={{ color: "#06b6d4", fontSize: "16px", marginTop: 0, marginBottom: "16px", fontWeight: "700" }}>
            📅 Monthly Spending
          </h3>
          {sortedMonths.length === 0 ? (
            <p style={{ color: "#aaa", textAlign: "center" }}>No data</p>
          ) : (
            <Bar data={barData} options={{
              plugins: {
                legend: { labels: { color: "#aaa" } },
                tooltip: { backgroundColor: "#1a1a2e", borderColor: "#06b6d444", borderWidth: 1 }
              },
              scales: {
                x: { ticks: { color: "#aaa" }, grid: { color: "#ffffff08" } },
                y: { ticks: { color: "#aaa" }, grid: { color: "#ffffff08" } }
              }
            }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;