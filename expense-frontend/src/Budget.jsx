import { useState, useEffect } from "react";
import axios from "axios";

function Budget() {
  const currentMonth = new Date().toISOString().substring(0, 7);
  const [month, setMonth] = useState(currentMonth);
  const [limit, setLimit] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/budget/status/${month}`);
      setStatus(res.data);
    } catch (err) {
      console.error("Failed to fetch budget status", err);
    }
  };

  const setBudget = async () => {
    if (!limit || !month) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }
    try {
      await axios.post("http://localhost:8080/budget/set", {
        limit: parseFloat(limit),
        month: month,
      });
      setMessage("✅ Budget set successfully!");
      fetchStatus();
    } catch (err) {
      setMessage("❌ Failed to set budget.");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [month]);

  const percentage = status?.limit > 0 ? (status.spent / status.limit) * 100 : 0;
  const barColor = status?.exceeded ? "#ef4444" : status?.warning ? "#f59e0b" : "#10b981";

  return (
    <div style={{ maxWidth: "600px", margin: "60px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "28px",
        fontWeight: "900",
        background: "linear-gradient(90deg, #f59e0b, #ef4444)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        Budget Manager 💰
      </h2>

      {/* Set Budget Form */}
      <div style={{
        background: "rgba(245,158,11,0.05)",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid #f59e0b33",
        marginBottom: "24px",
      }}>
        <h3 style={{ color: "#f59e0b", marginTop: 0, fontSize: "16px", fontWeight: "700" }}>
          Set Monthly Budget
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="Enter budget limit (₹)"
            style={inputStyle}
          />
          <button onClick={setBudget} style={{
            padding: "12px",
            background: "linear-gradient(90deg, #f59e0b, #ef4444)",
            color: "#fff",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "15px",
            boxShadow: "0 4px 20px #f59e0b44",
          }}>
            Set Budget ✨
          </button>
          {message && <p style={{ textAlign: "center", color: "#f59e0b", margin: 0 }}>{message}</p>}
        </div>
      </div>

      {/* Budget Status */}
      {status && status.limit > 0 && (
        <div style={{
          background: status.exceeded
            ? "rgba(239,68,68,0.08)"
            : status.warning
            ? "rgba(245,158,11,0.08)"
            : "rgba(16,185,129,0.08)",
          borderRadius: "20px",
          padding: "24px",
          border: `1px solid ${barColor}33`,
        }}>
          <h3 style={{ color: barColor, marginTop: 0, fontSize: "16px", fontWeight: "700" }}>
            {status.exceeded ? "🚨 Budget Exceeded!" : status.warning ? "⚠️ Warning: 80% Budget Used!" : "✅ Budget On Track"}
          </h3>

          {/* Progress Bar */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "30px",
            height: "16px",
            marginBottom: "16px",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${Math.min(percentage, 100)}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${barColor}, ${barColor}aa)`,
              borderRadius: "30px",
              transition: "width 0.5s ease",
            }} />
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div style={statCard}>
              <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 4px", textTransform: "uppercase" }}>Budget</p>
              <p style={{ color: "#10b981", fontSize: "22px", fontWeight: "900", margin: 0 }}>₹{status.limit}</p>
            </div>
            <div style={statCard}>
              <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 4px", textTransform: "uppercase" }}>Spent</p>
              <p style={{ color: barColor, fontSize: "22px", fontWeight: "900", margin: 0 }}>₹{status.spent.toFixed(2)}</p>
            </div>
            <div style={statCard}>
              <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 4px", textTransform: "uppercase" }}>Remaining</p>
              <p style={{ color: status.exceeded ? "#ef4444" : "#06b6d4", fontSize: "22px", fontWeight: "900", margin: 0 }}>
                ₹{(status.limit - status.spent).toFixed(2)}
              </p>
            </div>
            <div style={statCard}>
              <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 4px", textTransform: "uppercase" }}>Used</p>
              <p style={{ color: barColor, fontSize: "22px", fontWeight: "900", margin: 0 }}>
                {Math.min(percentage, 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {status && status.limit === 0 && (
        <p style={{ textAlign: "center", color: "#aaa" }}>No budget set for this month yet.</p>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "12px 16px",
  fontSize: "15px",
  borderRadius: "12px",
  border: "1px solid #f59e0b33",
  background: "rgba(245,158,11,0.05)",
  color: "#fff",
  outline: "none",
};

const statCard = {
  flex: 1,
  minWidth: "100px",
  background: "rgba(255,255,255,0.03)",
  borderRadius: "12px",
  padding: "12px 16px",
  textAlign: "center",
};

export default Budget;