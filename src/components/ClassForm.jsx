import { useState, useEffect } from 'react'
import { format, addDays, startOfWeek, addWeeks } from 'date-fns'

const DAYS_OF_WEEK = [
  { id: 0, name: 'Sun', fullName: 'Sunday' },
  { id: 1, name: 'Mon', fullName: 'Monday' },
  { id: 2, name: 'Tue', fullName: 'Tuesday' },
  { id: 3, name: 'Wed', fullName: 'Wednesday' },
  { id: 4, name: 'Thu', fullName: 'Thursday' },
  { id: 5, name: 'Fri', fullName: 'Friday' },
  { id: 6, name: 'Sat', fullName: 'Saturday' }
]

function ClassForm({ onSubmit, onCancel, initialData, initialDate }) {
  const [formData, setFormData] = useState({
    studentName: '',
    subject: '',
    date: format(initialDate || new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    paymentStatus: 'unpaid',
    amount: '',
    notes: ''
  })

  const [useMultipleDays, setUseMultipleDays] = useState(false)
  const [selectedDays, setSelectedDays] = useState([])
  const [numberOfWeeks, setNumberOfWeeks] = useState(1)
  const [weekStartDate, setWeekStartDate] = useState(
    format(startOfWeek(initialDate || new Date(), { weekStartsOn: 0 }), 'yyyy-MM-dd')
  )

  const isEditing = !!initialData

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentName: initialData.studentName,
        subject: initialData.subject,
        date: format(initialData.date, 'yyyy-MM-dd'),
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        paymentStatus: initialData.paymentStatus,
        amount: initialData.amount.toString(),
        notes: initialData.notes || ''
      })
      // When editing, disable multi-day selection
      setUseMultipleDays(false)
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (useMultipleDays && selectedDays.length > 0 && !isEditing) {
      // Generate classes for each selected day across the specified weeks
      const classes = []
      const baseWeekStart = new Date(weekStartDate)

      for (let week = 0; week < numberOfWeeks; week++) {
        const currentWeekStart = addWeeks(baseWeekStart, week)

        selectedDays.forEach(dayId => {
          const classDate = addDays(currentWeekStart, dayId)
          classes.push({
            studentName: formData.studentName,
            subject: formData.subject,
            date: classDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            paymentStatus: formData.paymentStatus,
            amount: parseFloat(formData.amount) || 0,
            notes: formData.notes
          })
        })
      }

      onSubmit(classes, true) // true indicates multiple classes
    } else {
      // Single class submission
      onSubmit({
        ...formData,
        date: new Date(formData.date),
        amount: parseFloat(formData.amount) || 0
      }, false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleDay = (dayId) => {
    setSelectedDays(prev =>
      prev.includes(dayId)
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId].sort((a, b) => a - b)
    )
  }

  const totalClassesToCreate = useMultipleDays ? selectedDays.length * numberOfWeeks : 1

  return (
    <div className="class-form-overlay">
      <form className="class-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Edit Class' : 'Add New Class'}</h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="studentName">Student Name *</label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              placeholder="e.g., John Smith"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="e.g., Math, Physics"
            />
          </div>
        </div>

        {/* Multi-day toggle - only show when adding new class */}
        {!isEditing && (
          <div className="multi-day-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={useMultipleDays}
                onChange={(e) => setUseMultipleDays(e.target.checked)}
              />
              <span className="toggle-text">Schedule recurring classes (multiple days)</span>
            </label>
          </div>
        )}

        {useMultipleDays && !isEditing ? (
          <>
            {/* Week selection for recurring classes */}
            <div className="form-group">
              <label>Starting Week *</label>
              <input
                type="date"
                value={weekStartDate}
                onChange={(e) => setWeekStartDate(e.target.value)}
                required
              />
              <span className="form-hint">Classes will be scheduled starting from this week</span>
            </div>

            {/* Day of week selection */}
            <div className="form-group">
              <label>Select Days of the Week *</label>
              <div className="day-selector">
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day.id}
                    type="button"
                    className={`day-button ${selectedDays.includes(day.id) ? 'selected' : ''}`}
                    onClick={() => toggleDay(day.id)}
                    title={day.fullName}
                  >
                    {day.name}
                  </button>
                ))}
              </div>
              {selectedDays.length === 0 && (
                <span className="form-hint error">Please select at least one day</span>
              )}
            </div>

            {/* Number of weeks */}
            <div className="form-group">
              <label htmlFor="numberOfWeeks">Number of Weeks *</label>
              <select
                id="numberOfWeeks"
                value={numberOfWeeks}
                onChange={(e) => setNumberOfWeeks(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(n => (
                  <option key={n} value={n}>{n} week{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {selectedDays.length > 0 && (
              <div className="classes-preview">
                Creating <strong>{totalClassesToCreate}</strong> class{totalClassesToCreate > 1 ? 'es' : ''}
                ({selectedDays.length} day{selectedDays.length > 1 ? 's' : ''}/week × {numberOfWeeks} week{numberOfWeeks > 1 ? 's' : ''})
              </div>
            )}
          </>
        ) : (
          /* Single date selection */
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time *</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time *</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount ($) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="e.g., 50.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="paymentStatus">Payment Status *</label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              required
            >
              <option value="unpaid">Unpaid</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            placeholder="Optional notes about this class..."
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-submit"
            disabled={useMultipleDays && selectedDays.length === 0}
          >
            {isEditing ? 'Update Class' : useMultipleDays ? `Add ${totalClassesToCreate} Classes` : 'Add Class'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClassForm
