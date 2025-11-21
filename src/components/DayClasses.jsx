import { format } from 'date-fns'

function DayClasses({ classes, onEdit, onDelete, onTogglePayment }) {
  const sortedClasses = [...classes].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime)
  })

  return (
    <div className="day-classes">
      {sortedClasses.map((classItem) => (
        <div key={classItem.id} className="class-card">
          <div className="class-header">
            <div className="class-time">
              {classItem.startTime} - {classItem.endTime}
            </div>
            <div
              className={`payment-badge ${classItem.paymentStatus}`}
              onClick={() => onTogglePayment(classItem.id)}
              title="Click to cycle payment status"
            >
              {classItem.paymentStatus}
            </div>
          </div>

          <div className="class-info">
            <h3>{classItem.studentName}</h3>
            <p className="subject">{classItem.subject}</p>
            <p className="amount">${classItem.amount.toFixed(2)}</p>
            {classItem.notes && <p className="notes">{classItem.notes}</p>}
          </div>

          <div className="class-actions">
            <button
              onClick={() => onEdit(classItem)}
              className="btn btn-small btn-edit"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(classItem.id)}
              className="btn btn-small btn-delete"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DayClasses
