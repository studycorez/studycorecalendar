import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format, isSameDay, parseISO } from 'date-fns'
import './App.css'
import ClassForm from './components/ClassForm'
import ClassList from './components/ClassList'
import DayClasses from './components/DayClasses'

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [classes, setClasses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)

  // Load classes from localStorage on mount
  useEffect(() => {
    const savedClasses = localStorage.getItem('studycore-classes')
    if (savedClasses) {
      const parsed = JSON.parse(savedClasses)
      // Convert date strings back to Date objects
      const classesWithDates = parsed.map(cls => ({
        ...cls,
        date: parseISO(cls.date)
      }))
      setClasses(classesWithDates)
    }
  }, [])

  // Save classes to localStorage whenever they change
  useEffect(() => {
    if (classes.length > 0) {
      const classesForStorage = classes.map(cls => ({
        ...cls,
        date: cls.date.toISOString()
      }))
      localStorage.setItem('studycore-classes', JSON.stringify(classesForStorage))
    }
  }, [classes])

  const handleAddClass = (classData) => {
    if (editingClass) {
      // Update existing class
      setClasses(classes.map(cls =>
        cls.id === editingClass.id ? { ...classData, id: editingClass.id } : cls
      ))
      setEditingClass(null)
    } else {
      // Add new class
      const newClass = {
        ...classData,
        id: Date.now().toString()
      }
      setClasses([...classes, newClass])
    }
    setShowForm(false)
  }

  const handleEditClass = (classItem) => {
    setEditingClass(classItem)
    setShowForm(true)
  }

  const handleDeleteClass = (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(cls => cls.id !== classId))
    }
  }

  const handleTogglePayment = (classId) => {
    setClasses(classes.map(cls => {
      if (cls.id === classId) {
        const statuses = ['unpaid', 'pending', 'paid']
        const currentIndex = statuses.indexOf(cls.paymentStatus)
        const nextStatus = statuses[(currentIndex + 1) % statuses.length]
        return { ...cls, paymentStatus: nextStatus }
      }
      return cls
    }))
  }

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayClasses = classes.filter(cls => isSameDay(cls.date, date))
      if (dayClasses.length > 0) {
        const paidCount = dayClasses.filter(cls => cls.paymentStatus === 'paid').length
        const pendingCount = dayClasses.filter(cls => cls.paymentStatus === 'pending').length
        const unpaidCount = dayClasses.filter(cls => cls.paymentStatus === 'unpaid').length

        return (
          <div className="calendar-tile-content">
            <div className="class-count">{dayClasses.length}</div>
            <div className="payment-indicators">
              {paidCount > 0 && <span className="payment-dot paid" title={`${paidCount} paid`}></span>}
              {pendingCount > 0 && <span className="payment-dot pending" title={`${pendingCount} pending`}></span>}
              {unpaidCount > 0 && <span className="payment-dot unpaid" title={`${unpaidCount} unpaid`}></span>}
            </div>
          </div>
        )
      }
    }
    return null
  }

  const selectedDayClasses = classes.filter(cls => isSameDay(cls.date, selectedDate))

  const stats = {
    total: classes.length,
    paid: classes.filter(cls => cls.paymentStatus === 'paid').length,
    pending: classes.filter(cls => cls.paymentStatus === 'pending').length,
    unpaid: classes.filter(cls => cls.paymentStatus === 'unpaid').length,
    totalRevenue: classes
      .filter(cls => cls.paymentStatus === 'paid')
      .reduce((sum, cls) => sum + (cls.amount || 0), 0)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>StudyCore Tutoring Calendar</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingClass(null)
            setShowForm(!showForm)
          }}
        >
          {showForm ? 'Cancel' : '+ Add Class'}
        </button>
      </header>

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Total Classes:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Paid:</span>
          <span className="stat-value paid">{stats.paid}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Pending:</span>
          <span className="stat-value pending">{stats.pending}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Unpaid:</span>
          <span className="stat-value unpaid">{stats.unpaid}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Revenue:</span>
          <span className="stat-value">${stats.totalRevenue.toFixed(2)}</span>
        </div>
      </div>

      {showForm && (
        <ClassForm
          onSubmit={handleAddClass}
          onCancel={() => {
            setShowForm(false)
            setEditingClass(null)
          }}
          initialData={editingClass}
          initialDate={selectedDate}
        />
      )}

      <div className="main-content">
        <div className="calendar-section">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={getTileContent}
            className="studycore-calendar"
          />
        </div>

        <div className="classes-section">
          <h2>{format(selectedDate, 'MMMM d, yyyy')}</h2>
          {selectedDayClasses.length > 0 ? (
            <DayClasses
              classes={selectedDayClasses}
              onEdit={handleEditClass}
              onDelete={handleDeleteClass}
              onTogglePayment={handleTogglePayment}
            />
          ) : (
            <p className="no-classes">No classes scheduled for this day</p>
          )}

          <div className="all-classes">
            <h2>All Upcoming Classes</h2>
            <ClassList
              classes={classes.filter(cls => cls.date >= new Date().setHours(0, 0, 0, 0))}
              onEdit={handleEditClass}
              onDelete={handleDeleteClass}
              onTogglePayment={handleTogglePayment}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
