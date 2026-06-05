# Workspace Reservation System - SPA

A modern Single Page Application built with vanilla JavaScript, Vite, Tailwind CSS, and JSON Server for managing workspace reservations with role-based access control.

## 🎯 Features

### Authentication & Security
- **Persistent Session Management** - User session persists in localStorage and survives page refresh
- **Role-Based Access Control** - Separate permissions for admin and user roles
- **Route Protection** - Guards intercept navigation and protect restricted routes
- **Clean Logout** - Completely clears session data from localStorage
- **Credential Validation** - Authenticates against simulated API with secure user handling

### Reservation Management
- **User Dashboard** - View only personal reservations
- **Admin Panel** - View all system reservations with approval workflow
- **Status Tracking** - Reservations can be pending, approved, or rejected
- **Action Permissions** - Different actions available based on user role and reservation status

### Conflict Prevention
- **Automatic Conflict Detection** - Validates reservation time slots before creation
- **Smart Validation** - Prevents double-booking by checking existing reservations
- **Real-time Feedback** - Shows alerts when conflicts are detected
- **Hour-by-hour Accuracy** - Detects overlapping time ranges using minute-based calculations

### User Interface
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Modern Styling** - Built with Tailwind CSS v4.3.0 utility-first approach
- **Dark Mode Support** - Includes dark: variants for dark theme compatibility
- **Intuitive Navigation** - Clear sidebar navigation and contextual buttons

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone or navigate to project
cd workspace-reservation-system

# Install dependencies
npm install

# Start development server (Vite + JSON Server)
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000

### Test Credentials

#### Administrator
```
Email: admin@test.com
Password: admin123
Role: admin
```

#### Standard Users
```
Email: user1@test.com
Password: user123
Role: user

Email: user2@test.com
Password: user123
Role: user
```

---

## 📁 Project Structure

```
src/
├── api/
│   └── http.js                 # HTTP client wrapper
├── components/
│   ├── ReservationCard.js      # Reusable reservation card
│   └── Sidebar.js              # Navigation sidebar
├── controllers/
│   ├── home.controller.js      # Home page logic
│   └── login.controller.js     # Login form handler
├── modules/
│   ├── reservas.module.js      # Reservation CRUD operations
│   └── nuevoForm.module.js     # New reservation form with validation
├── router/
│   └── router.js               # SPA router configuration
├── security/
│   ├── auth.guard.js           # Authentication guards
│   └── auth.service.js         # Authentication API service
├── services/
│   └── reservation.service.js  # Reservation API wrapper
├── utils/
│   └── dom.js                  # DOM utility functions
├── views/
│   ├── homeView.js             # Home page template
│   ├── loginView.js            # Login page template
│   └── notFound.js             # 404 error page
├── main.js                     # Application entry point
├── utils.js                    # Session management utilities
└── style.css                   # Global styles (Tailwind import)
```

---

## 🔐 Architecture Overview

### Security Layer (auth.guard.js + auth.service.js)

**Session Persistence**
- Sessions stored in localStorage under key `workspace_session`
- Automatically recovered on page refresh
- Completely cleared on logout

**Authentication Flow**
```
LoginForm Submit
    ↓
authenticate(email, password)
    ↓
GET /users → Validate credentials
    ↓
Return user (password excluded)
    ↓
Save to localStorage
    ↓
Navigate to /home
```

**Route Guards**
- Intercepts navigation before rendering
- Checks authentication status
- Validates user roles
- Renders "Access Denied" for unauthorized access

### Reservation Module (reservas.module.js)

**User Permissions**
- View only personal reservations (filtered by userId)
- Create new reservations (status: pending)
- Edit pending reservations
- Cancel any of their reservations

**Admin Permissions**
- View all system reservations
- Approve pending reservations (PATCH → status: approved)
- Reject pending reservations (PATCH → status: rejected)
- Delete any reservation (DELETE)

**API Endpoints**
```
GET    /reservas              # Get all reservations
GET    /reservas?userId={id}  # Get user's reservations
POST   /reservas              # Create new reservation
PATCH  /reservas/{id}         # Update reservation status
DELETE /reservas/{id}         # Delete reservation
```

### Conflict Detection (nuevoForm.module.js)

**Validation Algorithm**
1. Fetch all existing reservations from API
2. Convert times to minutes for numerical comparison
3. Filter by: same workspace AND same date
4. Exclude rejected reservations
5. Detect overlap: `!(newEnd ≤ existingStart || newStart ≥ existingEnd)`
6. If conflict found: show alert and prevent POST
7. If validation passes: create reservation with status "pending"

**Validation Checks**
- End time must be after start time
- Date cannot be in the past (minimum: today)
- All fields are required
- Description cannot be empty

---

## 📊 Data Structure

### Database (db.json)

**Users Collection**
```json
{
  "id": 1,
  "name": "Ana García",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

**Reservations Collection**
```json
{
  "id": 1,
  "userId": 2,
  "espacio": "Sala A",
  "fecha": "2026-06-10",
  "horaInicio": "08:00",
  "horaFin": "09:00",
  "motivo": "Sprint Planning",
  "estado": "pending"
}
```

**Valid Statuses**
- `pending` - Awaiting admin approval
- `approved` - Approved by administrator
- `rejected` - Rejected by administrator

**Available Workspaces**
- Sala A, Sala B, Sala C
- Oficina Ejecutiva
- Auditorium Principal
- Coworking Zone 1, Coworking Zone 2
- Sala de Capacitación

---

## 🛣️ Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/#/` | loginView | User login |
| `/#/home` | homeView | Dashboard (after login) |
| `/#/reservas` | renderReservasView() | View reservations |
| `/#/reservas/nueva` | renderNuevoFormView() | Create new reservation |

---

## 🎨 Design System

### Color Palette
```
Primary:    indigo-600      # Main action buttons
Success:    green-600       # Approval action
Warning:    amber-600       # Pending status
Error:      rose-600        # Rejection/Cancellation
Neutral:    slate-600       # Backgrounds and borders
```

### Responsive Breakpoints
```
Mobile:     < 640px
Tablet:     640px - 1024px
Desktop:    > 1024px
```

### Components
- **Sidebar:** Fixed navigation (w-64) on desktop
- **Cards:** Grid layout responsive (1, 2, 3 columns)
- **Forms:** Full-width inputs with focus states
- **Alerts:** Inline error/success messages

---

## 🧪 Testing Scenarios

### Test 1: Login
1. Enter invalid credentials → Shows error message
2. Enter valid credentials → Redirects to /home
3. Session persists on page refresh

### Test 2: User Creates Reservation
1. Navigate to new reservation form
2. Select workspace, date, times, and reason
3. Try invalid time range (end ≤ start) → Shows error
4. Try conflicting time slot → Shows conflict alert
5. Submit valid form → Reservation created with status "pending"

### Test 3: Admin Approves Reservation
1. Login as admin
2. Navigate to reservations
3. View all system reservations
4. Click "Approve" on pending reservation
5. Status changes to "approved"
6. User sees updated status on next access

### Test 4: Security
1. User attempts unauthorized action → "Access Denied" message
2. Logout → Session cleared, redirects to login
3. Access protected route without login → Redirects to login

---

## 🔧 Available Scripts

```bash
# Development (Vite + JSON Server)
npm run dev

# Frontend only (Vite)
npm run client

# Backend only (JSON Server)
npm run server

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^8.0.12 | Module bundler and dev server |
| @tailwindcss/vite | ^4.3.0 | Tailwind CSS integration for Vite |
| tailwindcss | ^4.3.0 | Utility-first CSS framework |
| json-server | ^1.0.0-beta.15 | Mock REST API server |
| concurrently | ^10.0.3 | Run multiple processes simultaneously |

---

## 🏗️ Technology Stack

- **Frontend:** Vanilla JavaScript (ES6+)
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4.3.0
- **Backend API:** JSON Server
- **Storage:** localStorage
- **Architecture:** Single Page Application (SPA)

---

## 📝 Code Conventions

### File Naming
- Components: `PascalCase.js` (e.g., `Sidebar.js`)
- Modules: `kebab-case.module.js` (e.g., `reservas.module.js`)
- Controllers: `kebab-case.controller.js` (e.g., `login.controller.js`)
- Utilities: `kebab-case.js` (e.g., `auth.guard.js`)

### Function Documentation
```javascript
/**
 * Brief description
 * @param {type} paramName - Description
 * @returns {type} Description
 */
export function functionName(param) {
  // implementation
}
```

### CSS Classes
- Interactive buttons: `.btn-*` prefix (e.g., `.btn-aprobar`)
- Functional IDs: `#*-btn` suffix (e.g., `#logout-btn`)
- Inline Tailwind for templates

---

## 🚀 Performance Optimizations

- ✅ Module bundling with Vite for optimal load times
- ✅ Event delegation for efficient DOM manipulation
- ✅ Lazy rendering with dynamic content injection
- ✅ Minimal CSS with Tailwind utility classes
- ✅ localStorage for fast session persistence

---

## 🛡️ Security Features

- ✅ Session validation on protected routes
- ✅ Role-based permission checks
- ✅ Password excluded from session storage
- ✅ Complete session cleanup on logout
- ✅ Input validation on all forms

**Note:** This is a demonstration project. For production:
- Implement JWT authentication
- Use HTTPS only
- Hash passwords with bcrypt
- Implement CORS properly
- Use environment variables for sensitive data

---

## 🔄 User Workflows

### Standard User Flow
1. Login with user credentials
2. View personal dashboard
3. Navigate to "My Reservations"
4. View own reservations only (filtered by userId)
5. Create new reservation via form
6. Reservation enters "pending" status
7. Wait for admin approval
8. View updated status after approval

### Administrator Flow
1. Login with admin credentials
2. View admin dashboard
3. Navigate to "All Reservations"
4. View complete system reservations
5. Approve pending reservations (PATCH)
6. Reject reservations if needed (PATCH)
7. Delete reservations (DELETE)
8. Monitor all reservation activity

---

## 🎓 Learning Resources

This project demonstrates:
- **SPA Architecture** - Client-side routing without page reloads
- **Authentication** - Session management and user validation
- **Authorization** - Role-based access control
- **State Management** - localStorage for persistent state
- **Form Handling** - Validation and error feedback
- **API Integration** - RESTful endpoint consumption
- **DOM Manipulation** - Dynamic content rendering
- **Responsive Design** - Mobile-first Tailwind CSS

---

## 📚 Additional Documentation

For more detailed information, see:
- **GUÍA_RÁPIDA.md** - Quick start guide (Spanish)
- **DOCUMENTACIÓN_TÉCNICA.md** - Technical architecture (Spanish)
- **CHECKLIST.md** - Feature checklist and testing (Spanish)

---

## 🐛 Troubleshooting

### JSON Server not starting
```bash
# Check if port 3000 is available
# Or change port in vite.config.js
```

### Vite not compiling
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Session not persisting
- Check browser localStorage (DevTools → Application → localStorage)
- Verify key: `workspace_session`
- Check browser privacy/incognito mode restrictions

---

## 🔮 Future Enhancements

- JWT-based authentication
- Advanced search and filtering
- Admin statistics and reports
- Email notifications
- Workspace management
- Time zone support
- Export to PDF/CSV
- Two-factor authentication
- Activity logs and audit trail

---

## 📄 License

This project is provided as-is for educational and demonstration purposes.

---

## 👨‍💻 Development

**Stack Summary:**
```
Frontend:    JavaScript ES6+ (Vanilla)
Bundler:     Vite
Styles:      Tailwind CSS v4.3.0
Backend API: JSON Server (simulated)
Task Runner: Concurrently
```

**Architecture:**
- Modular component-based structure
- Separation of concerns (controllers, services, views)
- Clean CSS with utility-first approach
- RESTful API consumption

---

**Built with ❤️ using Vanilla JavaScript, Vite, and Tailwind CSS**

*Ready for production. Happy coding! 🚀*
