import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "", inviteCode: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const path = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const data = await request(path, { method: "POST", body: form });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container narrow">
      <h1>Teacher {mode === "login" ? "Login" : "Registration"}</h1>
      <p className="subtitle">Only teachers can add or edit students</p>

      <form className="auth-card" onSubmit={submit}>
        {mode === "register" && (
          <>
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={update} placeholder="Enter your name" required />
          </>
        )}

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={update} placeholder="teacher@college.edu" required />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={update} placeholder="At least 6 characters" required minLength={6} />

        {mode === "register" && (
          <>
            <label>Teacher Invite Code</label>
            <input name="inviteCode" value={form.inviteCode} onChange={update} placeholder="Given by your department" />
          </>
        )}

        {error && <p className="error">{error}</p>}

        <button className="btn" disabled={busy}>
          {busy ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <p className="switch">
          {mode === "login" ? "New teacher?" : "Already registered?"}{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Register here" : "Login here"}
          </button>
        </p>
      </form>
    </div>
  );
}
