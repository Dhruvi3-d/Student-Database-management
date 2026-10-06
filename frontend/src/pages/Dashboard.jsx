import { useEffect, useState } from "react";
import StudentCard from "../components/StudentCard.jsx";
import { request } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const empty = { name: "", age: "", course: "" };

export default function Dashboard() {
  const { auth, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = () =>
    request("/students")
      .then(setStudents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  // if the token has expired, send the teacher back to login
  const handleError = (err) => {
    if (/token|login required/i.test(err.message)) logout();
    setError(err.message);
  };

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const body = { ...form, age: Number(form.age) };
    try {
      if (editingId) {
        await request(`/students/${editingId}`, { method: "PUT", body, token: auth.token });
        setMessage("Student updated");
      } else {
        await request("/students", { method: "POST", body, token: auth.token });
        setMessage("Student added to the database");
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      handleError(err);
    }
  };

  const edit = (s) => {
    setEditingId(s._id);
    setForm({ name: s.name, age: s.age, course: s.course });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete ${s.name}?`)) return;
    try {
      await request(`/students/${s._id}`, { method: "DELETE", token: auth.token });
      setMessage("Student deleted");
      load();
    } catch (err) {
      handleError(err);
    }
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Teacher Dashboard</h1>
      <p className="subtitle">Welcome, {auth.teacher.name}</p>

      <form className="auth-card" onSubmit={submit}>
        <h2>{editingId ? "Edit Student" : "Add Student"}</h2>

        <label>Name</label>
        <input name="name" value={form.name} onChange={update} placeholder="Student name" required />

        <label>Age</label>
        <input name="age" type="number" min="1" max="100" value={form.age} onChange={update} placeholder="Age" required />

        <label>Course</label>
        <input name="course" value={form.course} onChange={update} placeholder="e.g. BEIT" required />

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <div className="row">
          <button className="btn">{editingId ? "Update Student" : "Add Student"}</button>
          {editingId && (
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <input
        type="text"
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading students...</p>
      ) : filtered.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <div className="student-list">
          {filtered.map((s) => (
            <StudentCard key={s._id} student={s} onEdit={edit} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
