import { useState, useEffect } from "react";
import axios from "axios";
import AddExpense from "./AddExpense";
import ViewExpenses from "./ViewExpenses";
import Dashboard from "./Dashboard";
import Auth from "./Auth";
import Budget from "./Budget";
import { FaRobot, FaPlusCircle, FaList, FaChartPie, FaSignOutAlt, FaWallet } from "react-icons/fa";

function App() {
  const [page, setPage] = useState("chat");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const handleLogin = (newToken) => {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post("http://localhost:8080/ai/query", {
        question: question,
      });
      setResponse(res.data);
    } catch (err) {
      setResponse("Error: Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: "chat", label: "AI Assistant", icon: <FaRobot />, color: "#a855f7" },
    { id: "add", label: "Add Expense", icon: <FaPlusCircle />, color: "#06b6d4" },
    { id: "view", label: "View Expenses", icon: <FaList />, color: "#10b981" },
    { id: "dashboard", label: "Dashboard", icon: <FaChartPie />, color: "#f59e0b" },
    { id: "budget", label: "Budget", icon: <FaWallet />, color: "#ec4899" },
  ];

  return (
    <div style={{
      fontFamily: "'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0f0a 100%)",
      minHeight: "100vh",
      color: "#fff"
    }}>

      {/* Navbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "14px 32px",
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <span style={{
          fontWeight: "900",
          fontSize: "22px",
          marginRight: "auto",
          background: "linear-gradient(90deg, #a855f7, #06b6d4, #10b981)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px",
        }}>
          💸 SpendSmart
        </span>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 18px",
              borderRadius: "25px",
              border: page === item.id ? `2px solid ${item.color}` : "2px solid transparent",
              background: page === item.id ? `${item.color}22` : "rgba(255,255,255,0.05)",
              color: page === item.id ? item.color : "#aaa",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: page === item.id ? "700" : "400",
              transition: "all 0.2s",
              boxShadow: page === item.id ? `0 0 20px ${item.color}44` : "none",
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 18px",
            borderRadius: "25px",
            border: "2px solid #ef444444",
            background: "rgba(239,68,68,0.1)",
            color: "#ef4444",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Pages */}
      {page === "chat" && (
        <div style={{ maxWidth: "750px", margin: "60px auto", padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #a855f7, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              margin: "0 auto 20px",
              boxShadow: "0 0 40px #a855f744",
            }}>
              🤖
            </div>
            <h1 style={{
              fontSize: "36px",
              fontWeight: "900",
              background: "linear-gradient(90deg, #a855f7, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 10px",
            }}>
              AI Expense Assistant
            </h1>
            <p style={{ color: "#666", fontSize: "15px", margin: 0 }}>
              Ask me anything about your expenses!
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: "14px 20px",
                fontSize: "16px",
                borderRadius: "30px",
                border: "2px solid #a855f744",
                background: "rgba(168,85,247,0.05)",
                color: "#fff",
                outline: "none",
              }}
            />
            <button
              onClick={askQuestion}
              style={{
                padding: "14px 28px",
                fontSize: "16px",
                background: "linear-gradient(90deg, #a855f7, #06b6d4)",
                color: "#fff",
                border: "none",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "700",
                boxShadow: "0 4px 20px #a855f744",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "..." : "Ask ✨"}
            </button>
          </div>

          {response && (
            <div style={{
              marginTop: "24px",
              padding: "24px",
              background: "rgba(168,85,247,0.05)",
              borderRadius: "20px",
              border: "1px solid #a855f733",
              whiteSpace: "pre-wrap",
              lineHeight: "1.8",
            }}>
              <p style={{
                color: "#a855f7",
                fontWeight: "700",
                marginBottom: "12px",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}>
                ✨ Response
              </p>
              <p style={{ color: "#ddd", margin: 0, fontSize: "15px" }}>{response}</p>
            </div>
          )}
        </div>
      )}

      {page === "add" && <AddExpense />}
      {page === "view" && <ViewExpenses />}
      {page === "dashboard" && <Dashboard />}
      {page === "budget" && <Budget />}

    </div>
  );
}

export default App;