import { Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useAuth } from "./AuthContext.jsx";
import "./App.css";

function ProtectedRoute({ children }) {
  const { auth } = useAuth();
  return auth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { auth, logout } = useAuth();

  return (
    <>
      <nav className="topbar">
        <Link to="/">Home</Link>
        {auth ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button className="link-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Teacher Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={auth ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
