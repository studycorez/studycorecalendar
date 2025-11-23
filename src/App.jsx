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

  const handleAddClass = (classData, isMultiple = false) => {
    if (editingClass) {
      // Update existing class
      setClasses(classes.map(cls =>
        cls.id === editingClass.id ? { ...classData, id: editingClass.id } : cls
      ))
      setEditingClass(null)
    } else if (isMultiple && Array.isArray(classData)) {
      // Add multiple classes at once
      const newClasses = classData.map((cls, index) => ({
        ...cls,
        id: `${Date.now()}-${index}`
      }))
      setClasses([...classes, ...newClasses])
    } else {
      // Add single new class
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
        // Sort by time
        const sortedClasses = [...dayClasses].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        )

        // Show up to 3 students, then "+N more"
        const displayClasses = sortedClasses.slice(0, 3)
        const remaining = sortedClasses.length - 3

        return (
          <div className="calendar-tile-content">
            <div className="student-bubbles">
              {displayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className={`student-bubble ${cls.paymentStatus}`}
                  title={`${cls.studentName} - ${cls.subject} (${cls.startTime}) - ${cls.paymentStatus}`}
                >
                  <span className="bubble-time">{cls.startTime.slice(0, 5)}</span>
                  <span className="bubble-name">{cls.studentName.split(' ')[0]}</span>
                </div>
              ))}
              {remaining > 0 && (
                <div className="student-bubble more">
                  +{remaining} more
                </div>
              )}
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
          <div className="legend">
            <div className="legend-item">
              <span className="legend-dot paid"></span>
              <span>Paid</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot pending"></span>
              <span>Pending</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot unpaid"></span>
              <span>Unpaid</span>
            </div>
          </div>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={getTileContent}
            className="studycore-calendar"
          />
        </div>

        <div className="classes-section">
          <div className="section-header">
            <h2>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
            <button
              className="btn btn-add-small"
              onClick={() => {
                setEditingClass(null)
                setShowForm(true)
              }}
              title="Add class to this day"
            >
              + Add
            </button>
          </div>
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
