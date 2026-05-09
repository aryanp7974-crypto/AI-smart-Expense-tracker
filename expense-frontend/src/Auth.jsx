import { useState } from "react";
import axios from "axios";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const url = isLogin
        ? "http://localhost:8080/auth/login"
        : "http://localhost:8080/auth/register";

      const body = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await axios.post(url, body);
      const token = res.data;

      if (token.includes("not found") || token.includes("Invalid") || token.includes("already")) {
        setMessage("❌ " + token);
      } else {
        localStorage.setItem("token", token);
        onLogin(token);
      }
    } catch (err) {
      setMessage("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      fontFamily: "'Segoe UI', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>

      {/* Background blobs */}
      <div style={{
        position: "absolute", width: "500px", height: "500px",
        borderRadius: "50%", background: "radial-gradient(circle, #a855f733, transparent)",
        top: "-100px", left: "-100px", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: "400px", height: "400px",
        borderRadius: "50%", background: "radial-gradient(circle, #06b6d422, transparent)",
        bottom: "-50px", right: "-50px", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: "300px", height: "300px",
        borderRadius: "50%", background: "radial-gradient(circle, #10b98122, transparent)",
        bottom: "30%", left: "30%", pointerEvents: "none",
      }} />

      {/* Left Panel */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px",
        display: window.innerWidth < 768 ? "none" : "flex",
      }}>
        <div style={{ maxWidth: "400px" }}>
          <div style={{
            fontSize: "48px",
            fontWeight: "900",
            background: "linear-gradient(135deg, #a855f7, #06b6d4, #10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "16px",
            lineHeight: "1.2",
          }}>
            Track your<br />expenses<br />smarter. 💸
          </div>
          <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.7" }}>
            AI-powered expense tracking with real-time insights, budget management, and smart analytics.
          </p>

          {/* Feature list */}
          {[
            { icon: "🤖", text: "AI Assistant for expense insights" },
            { icon: "📊", text: "Beautiful charts and analytics" },
            { icon: "💰", text: "Smart budget management" },
            { icon: "🔒", text: "Secure JWT authentication" },
          ].map((f) => (
            <div key={f.text} style={{
              display: "flex", alignItems: "center", gap: "12px",
              marginTop: "16px", color: "#888", fontSize: "14px",
            }}>
              <span style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "rgba(168,85,247,0.1)", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "18px",
                border: "1px solid #a855f722",
              }}>{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={{
        width: "100%",
        maxWidth: "480px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px",
        background: "rgba(255,255,255,0.02)",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: "linear-gradient(135deg, #a855f7, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", boxShadow: "0 4px 15px #a855f744",
            }}>💸</div>
            <span style={{
              fontSize: "22px", fontWeight: "900",
              background: "linear-gradient(90deg, #a855f7, #06b6d4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>SpendSmart</span>
          </div>
          <h2 style={{ color: "#fff", fontSize: "28px", fontWeight: "800", margin: "0 0 6px" }}>
            {isLogin ? "Welcome back 👋" : "Create account 🚀"}
          </h2>
          <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>
            {isLogin ? "Sign in to your account to continue" : "Start tracking your expenses today"}
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "14px",
          padding: "4px",
          marginBottom: "28px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {["Login", "Register"].map((tab) => (
            <button
              key={tab}
              onClick={() => setIsLogin(tab === "Login")}
              style={{
                flex: 1, padding: "10px",
                border: "none", borderRadius: "10px",
                background: (isLogin && tab === "Login") || (!isLogin && tab === "Register")
                  ? "linear-gradient(90deg, #a855f7, #06b6d4)"
                  : "transparent",
                color: (isLogin && tab === "Login") || (!isLogin && tab === "Register")
                  ? "#fff" : "#555",
                cursor: "pointer",
                fontWeight: "600", fontSize: "14px",
                transition: "all 0.2s",
              }}
            >{tab}</button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {!isLogin && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="John Doe"
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password" name="password" value={form.password}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              padding: "14px",
              fontSize: "15px",
              background: "linear-gradient(90deg, #a855f7, #06b6d4)",
              color: "#fff", border: "none",
              borderRadius: "14px", cursor: "pointer",
              fontWeight: "700", marginTop: "8px",
              boxShadow: "0 4px 20px #a855f744",
              transition: "opacity 0.2s",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
          </button>

          {message && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: message.includes("❌") ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
              border: `1px solid ${message.includes("❌") ? "#ef444433" : "#10b98133"}`,
              color: message.includes("❌") ? "#ef4444" : "#10b981",
              fontSize: "14px", textAlign: "center",
            }}>
              {message}
            </div>
          )}
        </div>

        <p style={{ color: "#333", fontSize: "12px", textAlign: "center", marginTop: "32px" }}>
          By continuing you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", color: "#666",
  fontSize: "12px", fontWeight: "600",
  marginBottom: "6px", textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const inputStyle = {
  width: "100%", padding: "13px 16px",
  fontSize: "15px", borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff", outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export default Auth;