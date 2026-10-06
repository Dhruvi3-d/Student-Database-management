import { useEffect, useState } from "react";
import StudentCard from "../components/StudentCard.jsx";
import { request } from "../api.js";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    request("/students")
      .then((data) => setStudents(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Student Management</h1>
      <p className="subtitle">Students from MongoDB Atlas</p>

      <input
        type="text"
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filtered.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <div className="student-list">
          {filtered.map((s) => (
            <StudentCard key={s._id} student={s} />
          ))}
        </div>
      )}
    </div>
  );
}
