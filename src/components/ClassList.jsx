import { format } from 'date-fns'

function ClassList({ classes, onEdit, onDelete, onTogglePayment }) {
  const sortedClasses = [...classes].sort((a, b) => {
    const dateCompare = a.date - b.date
    if (dateCompare !== 0) return dateCompare
    return a.startTime.localeCompare(b.startTime)
  })

  if (sortedClasses.length === 0) {
    return <p className="no-classes">No upcoming classes</p>
  }

  return (
    <div className="class-list">
      <div className="class-list-table">
        <div className="table-header">
          <div>Date</div>
          <div>Time</div>
          <div>Student</div>
          <div>Subject</div>
          <div>Amount</div>
          <div>Payment</div>
          <div>Actions</div>
        </div>
        {sortedClasses.map((classItem) => (
          <div key={classItem.id} className="table-row">
            <div>{format(classItem.date, 'MMM d, yyyy')}</div>
            <div>{classItem.startTime} - {classItem.endTime}</div>
            <div>{classItem.studentName}</div>
            <div>{classItem.subject}</div>
            <div>${classItem.amount.toFixed(2)}</div>
            <div>
              <span
                className={`payment-badge ${classItem.paymentStatus}`}
                onClick={() => onTogglePayment(classItem.id)}
                title="Click to cycle payment status"
              >
                {classItem.paymentStatus}
              </span>
            </div>
            <div className="table-actions">
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
    </div>
  )
}

export default ClassList
