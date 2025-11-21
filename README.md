# StudyCore Tutoring Calendar

A professional calendar application for managing tutoring classes and tracking payment status.

## Features

- **Interactive Calendar View**: Visual calendar showing all scheduled classes
- **Class Management**: Add, edit, and delete tutoring sessions
- **Payment Tracking**: Track payment status (Paid, Pending, Unpaid) for each class
- **Student Information**: Store student names, subjects, and session details
- **Revenue Tracking**: Automatic calculation of total revenue from paid classes
- **Data Persistence**: All data is saved locally in your browser
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## How to Use

### Adding a Class

1. Click the **"+ Add Class"** button in the header
2. Fill in the class details:
   - Student Name
   - Subject
   - Date
   - Start and End Time
   - Amount ($)
   - Payment Status
   - Notes (optional)
3. Click **"Add Class"** to save

### Managing Classes

- **View Classes**: Click on any date in the calendar to see classes scheduled for that day
- **Edit Class**: Click the **"Edit"** button on any class card
- **Delete Class**: Click the **"Delete"** button (confirmation required)
- **Update Payment**: Click on the payment badge to cycle through statuses:
  - Unpaid → Pending → Paid → Unpaid

### Calendar Features

- **Class Indicators**: Days with classes show a number badge and colored dots:
  - Green dot = Paid classes
  - Yellow dot = Pending classes
  - Red dot = Unpaid classes
- **Selected Day**: Click any date to view classes scheduled for that day
- **Today Highlight**: Current day is highlighted in yellow

### Dashboard Statistics

The top bar shows:
- Total number of classes
- Number of paid classes
- Number of pending classes
- Number of unpaid classes
- Total revenue from paid classes

## Data Storage

All class data is stored in your browser's localStorage, meaning:
- Data persists across browser sessions
- Data is stored locally on your device
- No backend server required
- Data is not synced across devices

## Technology Stack

- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **react-calendar**: Calendar component
- **date-fns**: Date formatting and manipulation
- **CSS**: Custom styling with responsive design

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- LocalStorage API
- CSS Grid and Flexbox

## Future Enhancements

Potential features to add:
- Export data to CSV/PDF
- Recurring class scheduling
- Email reminders
- Backend integration for data sync
- Multi-user support
- Analytics and reporting
- Print-friendly views
- Search and filter functionality

## License

MIT
