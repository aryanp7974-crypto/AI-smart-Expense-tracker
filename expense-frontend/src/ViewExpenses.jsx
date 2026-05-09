import { useState, useEffect } from "react";
import axios from "axios";

function ViewExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({
    category: "", amount: "", date: "", description: "",
  });

  const categories = ["All", "Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Other"];

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/expenses/${id}`);
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  const startEdit = (expense) => {
    setEditingExpense(expense.id);
    setEditForm({
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      description: expense.description || "",
    });
  };

  const cancelEdit = () => setEditingExpense(null);

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:8080/expenses/${id}`, {
        category: editForm.category,
        amount: parseFloat(editForm.amount),
        date: editForm.date,
        description: editForm.description,
      });
      setExpenses(expenses.map((e) =>
        e.id === id ? { ...e, ...editForm, amount: parseFloat(editForm.amount) } : e
      ));
      setEditingExpense(null);
    } catch (err) {
      console.error("Failed to update expense", err);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const filtered = filter === "All" ? expenses : expenses.filter((e) => e.category === filter);
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "28px",
        fontWeight: "900",
        background: "linear-gradient(90deg, #10b981, #06b6d4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        My Expenses 💰
      </h2>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px", justifyContent: "center" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: `1px solid ${filter === cat ? "#10b981" : "#ffffff22"}`,
              background: filter === cat ? "#10b98122" : "transparent",
              color: filter === cat ? "#10b981" : "#aaa",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: filter === cat ? "700" : "400",
              transition: "all 0.2s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Total */}
      <div style={{
        textAlign: "right",
        marginBottom: "16px",
        padding: "10px 20px",
        background: "rgba(16,185,129,0.08)",
        borderRadius: "12px",
        border: "1px solid #10b98122",
      }}>
        <span style={{ color: "#aaa", fontSize: "14px" }}>Total: </span>
        <span style={{ color: "#10b981", fontWeight: "900", fontSize: "20px" }}>₹{total.toFixed(2)}</span>
      </div>

      {loading && <p style={{ textAlign: "center", color: "#aaa" }}>Loading...</p>}
      {!loading && filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#aaa" }}>No expenses found.</p>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ overflowX: "auto", borderRadius: "16px", border: "1px solid #ffffff11" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(16,185,129,0.08)" }}>
                {["#", "Category", "Amount", "Date", "Description", "Actions"].map(h => (
                  <th key={h} style={{
                    padding: "14px 16px",
                    textAlign: "left",
                    color: "#10b981",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((expense, index) => (
                <tr key={expense.id} style={{
                  background: index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  borderBottom: "1px solid #ffffff08",
                  transition: "background 0.2s",
                }}>
                  {editingExpense === expense.id ? (
                    <>
                      <td style={td}>{index + 1}</td>
                      <td style={td}>
                        <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} style={editInput}>
                          {["Food","Transport","Shopping","Bills","Health","Entertainment","Other"].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </td>
                      <td style={td}>
                        <input type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} style={editInput} />
                      </td>
                      <td style={td}>
                        <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} style={editInput} />
                      </td>
                      <td style={td}>
                        <input type="text" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} style={editInput} />
                      </td>
                      <td style={td}>
                        <button onClick={() => saveEdit(expense.id)} style={{ ...actionBtn, background: "linear-gradient(90deg, #10b981, #06b6d4)", marginRight: "6px" }}>Save</button>
                        <button onClick={cancelEdit} style={{ ...actionBtn, background: "rgba(255,255,255,0.1)" }}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ ...td, color: "#666" }}>{index + 1}</td>
                      <td style={td}>
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: "20px",
                          background: `${categoryColor(expense.category)}22`,
                          color: categoryColor(expense.category),
                          fontSize: "12px",
                          fontWeight: "600",
                          border: `1px solid ${categoryColor(expense.category)}44`,
                        }}>
                          {expense.category}
                        </span>
                      </td>
                      <td style={{ ...td, color: "#10b981", fontWeight: "700" }}>₹{expense.amount}</td>
                      <td style={{ ...td, color: "#aaa" }}>{expense.date}</td>
                      <td style={{ ...td, color: "#666" }}>{expense.description || "-"}</td>
                      <td style={td}>
                        <button onClick={() => startEdit(expense)} style={{ ...actionBtn, background: "rgba(168,85,247,0.2)", color: "#a855f7", marginRight: "6px" }}>✏️ Edit</button>
                        <button onClick={() => deleteExpense(expense.id)} style={{ ...actionBtn, background: "rgba(239,68,68,0.2)", color: "#ef4444" }}>🗑️ Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const td = { padding: "14px 16px", color: "#fff", fontSize: "14px" };

const editInput = {
  padding: "8px 10px",
  fontSize: "13px",
  borderRadius: "8px",
  border: "1px solid #10b98144",
  background: "rgba(16,185,129,0.05)",
  color: "#fff",
  width: "100%",
  outline: "none",
};

const actionBtn = {
  padding: "6px 14px",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  color: "#fff",
};

function categoryColor(category) {
  const colors = {
    Food: "#ef4444",
    Transport: "#3b82f6",
    Shopping: "#a855f7",
    Bills: "#f59e0b",
    Health: "#10b981",
    Entertainment: "#ec4899",
    Other: "#6b7280",
  };
  return colors[category] || "#6b7280";
}

export default ViewExpenses;