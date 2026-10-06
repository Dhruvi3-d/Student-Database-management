export default function StudentCard({ student, onEdit, onDelete }) {
  return (
    <div className="card">
      <h3>{student.name}</h3>
      <p>Age: {student.age}</p>
      <p>Course: {student.course}</p>

      {(onEdit || onDelete) && (
        <div className="card-actions">
          {onEdit && (
            <button className="btn small" onClick={() => onEdit(student)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="btn small danger" onClick={() => onDelete(student)}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
