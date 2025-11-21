import { useState, useEffect } from 'react'
import { format } from 'date-fns'

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
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      date: new Date(formData.date),
      amount: parseFloat(formData.amount) || 0
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="class-form-overlay">
      <form className="class-form" onSubmit={handleSubmit}>
        <h2>{initialData ? 'Edit Class' : 'Add New Class'}</h2>

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
            />
          </div>
        </div>

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
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Update Class' : 'Add Class'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClassForm
