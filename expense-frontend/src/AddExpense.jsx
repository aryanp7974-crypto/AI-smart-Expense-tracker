import { useState } from "react";
import axios from "axios";

function AddExpense() {
  const [form, setForm] = useState({
    category: "", amount: "", date: "", description: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.category || !form.amount || !form.date) {
      setMessage("⚠️ Please fill in all required fields.");
      return;
    }
    try {
      await axios.post("http://localhost:8080/expenses", {
        category: form.category,
        amount: parseFloat(form.amount),
        date: form.date,
        description: form.description,
      });
      setMessage("✅ Expense added successfully!");
      setForm({ category: "", amount: "", date: "", description: "" });
    } catch (err) {
      setMessage("❌ Failed to add expense. Is the backend running?");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "60px auto", padding: "20px" }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "28px",
        fontWeight: "900",
        background: "linear-gradient(90deg, #06b6d4, #10b981)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        Add Expense 💸
      </h2>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: "rgba(6,182,212,0.05)",
        padding: "30px",
        borderRadius: "24px",
        border: "1px solid #06b6d433",
        boxShadow: "0 8px 32px #06b6d411",
      }}>
        <label style={labelStyle}>Category *</label>
        <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
          <option value="">-- Select Category --</option>
          {["Food","Transport","Shopping","Bills","Health","Entertainment","Other"].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label style={labelStyle}>Amount (₹) *</label>
        <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="e.g. 500" style={inputStyle} />

        <label style={labelStyle}>Date *</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Description (optional)</label>
        <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="e.g. Lunch at cafe" style={inputStyle} />

        <button onClick={handleSubmit} style={{
          padding: "14px",
          fontSize: "16px",
          background: "linear-gradient(90deg, #06b6d4, #10b981)",
          color: "#fff",
          border: "none",
          borderRadius: "30px",
          cursor: "pointer",
          fontWeight: "700",
          marginTop: "8px",
          boxShadow: "0 4px 20px #06b6d444",
        }}>
          Add Expense ✨
        </button>

        {message && (
          <p style={{ textAlign: "center", color: "#06b6d4", marginTop: "8px", fontWeight: "600" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const labelStyle = { color: "#06b6d4", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" };

const inputStyle = {
  padding: "12px 16px",
  fontSize: "15px",
  borderRadius: "12px",
  border: "1px solid #06b6d433",
  background: "rgba(6,182,212,0.05)",
  color: "#fff",
  outline: "none",
};

export default AddExpense;