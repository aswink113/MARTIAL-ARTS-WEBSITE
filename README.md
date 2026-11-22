# 🥋 Warrior Martial Arts Academy – Web Application & ERP

A full-stack, production-ready Martial Arts Academy Web Application & ERP system built with **React.js + Vite**, **Django REST Framework**, and **PostgreSQL** (with zero-friction fallback to SQLite).

Styled with a modern, high-contrast theme matching the design specification:
- Deep charcoal & dark header/hero (`#0F1117`) with bold martial arts action imagery
- Vibrant Crimson Red branding accents (`#DC2626` / `#E50914`)
- Clean, crisp light content sections (`#FFFFFF` & `#F8FAFC`) with elevated card elevations and smooth responsive typography

---

## 📁 Clean Folder Structure

```
MARTIAL-ARTS-WEBSITE/
├── backend/                        # Django REST API & ERP Backend
│   ├── core/                       # Project configuration & settings
│   │   ├── settings.py             # PostgreSQL + SQLite fallback, CORS, JWT
│   │   ├── urls.py                 # Core routing (Admin, Public API, ERP API)
│   │   └── wsgi.py
│   ├── academy/                    # Public Academy Application
│   │   ├── models.py               # Course, Instructor, ClassSchedule, Fee, Gallery, Achievement, Enquiry, Settings
│   │   ├── serializers.py          # DRF Serializers
│   │   ├── views.py                # Public API endpoints
│   │   ├── urls.py                 # REST URL routes
│   │   └── admin.py                # Django Admin with badges, filters, search & actions
│   ├── erp/                        # Role-Based ERP System
│   │   ├── models.py               # UserProfile, StudentMember, Attendance
│   │   ├── serializers.py          # JWT Token & ERP Serializers
│   │   ├── views.py                # Role-based dashboard stats, enquiries pipeline, attendance
│   │   ├── urls.py                 # ERP & Auth routes
│   │   └── admin.py                # Student and Attendance Admin panels
│   ├── seed_data.py                # Full database seeding script with demo courses, senseis & users
│   ├── manage.py
│   ├── .env.example
│   └── .env
│
├── frontend/                       # React.js + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.jsx          # Responsive navigation with mobile drawer & ERP status
│   │   │   ├── Header.jsx          # Header alias
│   │   │   ├── Footer.jsx          # Full footer with schedule, contact info & socials
│   │   │   ├── CourseCard.jsx      # Class card with age badge, price & CTAs
│   │   │   ├── InstructorCard.jsx  # Coach card with Dan ranks & bio
│   │   │   ├── GalleryGrid.jsx     # Category-filtered media grid with video & image lightbox
│   │   │   ├── Timetable.jsx       # Interactive day-by-day timetable
│   │   │   ├── AdmissionForm.jsx   # Live API form with validation & success modal
│   │   │   ├── WhatsAppButton.jsx  # Floating WhatsApp & direct call button
│   │   │   └── SocialIcons.jsx     # Clean SVG social icons
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Hero ('DISCIPLINE. FOCUS. STRENGTH.'), features, classes, stats
│   │   │   ├── Courses.jsx         # Full course catalog with age filter and search
│   │   │   ├── CourseDetails.jsx   # Curriculum, batch schedules, fees & direct registration
│   │   │   ├── About.jsx           # Dojo history, values, instructors roster, achievements
│   │   │   ├── Gallery.jsx         # Media vault with lightbox & video embedding
│   │   │   ├── Admission.jsx       # Timetable, Admission Form, Tuition guide, FAQs
│   │   │   ├── Contact.jsx         # Contact cards, form, Google Maps & WhatsApp
│   │   │   ├── PortalLogin.jsx     # Role-based login with 1-click demo credentials
│   │   │   ├── ERPDashboard.jsx    # Role-based ERP dashboard (Admin, Instructor, Student)
│   │   │   └── NotFound.jsx        # Custom 404 page
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # JWT authentication & role management
│   │   ├── services/
│   │   │   └── api.js              # Centralized Axios API client with interceptors
│   │   ├── styles/
│   │   │   └── main.css            # Complete martial arts design system
│   │   ├── App.jsx                 # Routing configuration
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── deploy/                         # Production VPS Deployment
│   ├── nginx.conf                  # Nginx reverse proxy configuration
│   ├── gunicorn.service            # Systemd service for Django REST backend
│   └── deploy.sh                   # Automated deployment script for Ubuntu/Debian VPS
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup (Django REST Framework)

```bash
cd backend

# Create or activate virtual environment (optional)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt psycopg2 pillow python-dotenv

# Run database migrations
python manage.py makemigrations academy
python manage.py makemigrations erp
python manage.py migrate

# Seed complete realistic demo data (courses, instructors, schedules, gallery, demo accounts)
python seed_data.py

# Start Django Backend Server (runs at http://127.0.0.1:8000)
python manage.py runserver 127.0.0.1:8000
```

### 2. Frontend Setup (React.js + Vite)

```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite Development Server (runs at http://localhost:5173)
npm run dev

# Or build for production
npm run build
```

---

## 🔑 Role-Based ERP Login Accounts

The database comes pre-seeded with 3 roles ready for testing at **`http://localhost:5173/portal/login`**:

| Role | Username | Password | Capabilities |
|------|----------|----------|--------------|
| **👑 Admin / Dojo Owner** | `admin` | `admin123` | Full ERP dashboard, Enquiries Pipeline (filter, update status, convert to student member), Student Roster, Batches, direct Django Admin access |
| **🥋 Sensei / Instructor** | `instructor` | `instructor123` | Assigned batches schedule, student roster, interactive daily attendance sheet with 1-click submit |
| **👦 Student Member** | `student` | `student123` | Registered curriculum, current belt rank progression bar, assigned batch schedule, attendance history, membership fee status |

**Django Admin Panel**:
- URL: `http://127.0.0.1:8000/admin/`
- Username: `admin` | Password: `admin123`

---

## 🌐 REST API Endpoints

### Public Endpoints
- `GET /api/settings/` - Dojo branding, contacts, social URLs, home stats
- `GET /api/courses/` - List active courses (supports `?category=` filter)
- `GET /api/courses/<slug>/` - Single course details with batches and fees
- `GET /api/instructors/` - Instructors roster (supports `?head_coach=true`)
- `GET /api/schedules/` - Class timetable (supports `?day=` and `?course=` filters)
- `GET /api/fees/` - Tuition fees breakdown
- `GET /api/gallery/` - Media items (supports `?category=` filter)
- `GET /api/achievements/` - Academy awards and trophies
- `POST /api/admission-enquiries/` - Submit online admission enquiry

### ERP & Authentication Endpoints
- `POST /api/auth/login/` - JWT login returning tokens and user role
- `GET /api/auth/me/` - Current user profile and student info
- `GET /api/erp/dashboard-stats/` - Role-customized analytics & metrics
- `GET /api/erp/enquiries/` - Manage enquiries pipeline (filter by status, search)
- `PATCH /api/erp/enquiries/<id>/` - Update enquiry status / convert to member
- `GET /api/erp/students/` - Student members roster
- `POST /api/erp/attendance/` - Bulk mark student attendance

---

## 🛡️ Production Deployment (Linux VPS with Nginx & Gunicorn)

Detailed configuration files are provided in the `deploy/` directory:
- `deploy/nginx.conf`: Reverse proxies `/api` and `/admin` to Gunicorn (`127.0.0.1:8000`) and serves the React build from `/var/www/martial-arts/frontend/dist`.
- `deploy/gunicorn.service`: Systemd service to auto-start and monitor the Django WSGI application.
- `deploy/deploy.sh`: One-script deployment command.
