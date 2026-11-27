# Greentrack Martial Arts — Academy Website & Admin Panel

A single-domain website with a **React + Vite public frontend** and a Django backend for the academy API, database, admissions, and staff management panel. Django also serves the built React app, so the public website, API, media, and admin all use one hostname.

---

## Local Setup & Run

```bash
pip install -r requirements.txt
python manage.py migrate
python seed_data.py
python manage.py runserver
```

- **Academy Admin Panel:** `http://127.0.0.1:8000/academy-panel/`

In a second terminal, start the React development site:

```bash
cd frontend
npm ci
npm run dev
```

- **React Website (development):** `http://127.0.0.1:5173/` (`/api/` calls proxy to Django)
- **Academy Admin Panel:** `http://127.0.0.1:8000/academy-panel/`

For production on one domain, run `npm run build` from `frontend/`, then `python manage.py collectstatic --noinput`. Django serves the React app for public URLs; `/api/`, `/academy-panel/`, `/admin/`, `/static/`, and `/media/` share the same hostname. See `deploy/nginx.conf` and `deploy/deploy.sh` for the VPS configuration. Point your domain at the VPS, update the placeholder hostname and certificate paths in Nginx, and set `DEBUG=False`, a strong `DJANGO_SECRET_KEY`, and the public hostname in `ALLOWED_HOSTS` on the server. A real domain and hosting account are still needed to make the site publicly reachable.

---

## Single Admin Login

| Username | Password | Access |
| :--- | :--- | :--- |
| `admin` | `Greentrack@2026` | Full editing access to all website content, banners, courses, timetable, instructors, gallery, achievements, enquiries, and admission applications |

You can change the admin password anytime inside the admin panel under **Change Password** (`/academy-panel/account/`).

---

## Quick Admin Guide

1. **Sign In:** Open `/academy-panel/` and sign in as `admin`.
2. **Courses & Training:** Add, edit, archive/publish, or delete courses with curriculum skills, fees, and photos.
3. **Class Timetable:** Add, edit, pause, or delete weekly sessions and manage age categories (conflict detection prevents overlapping studio bookings).
4. **Instructors:** Add or edit coach portraits, ranks, qualifications, and biographies.
5. **Gallery & Achievements:** Upload photos/video links and publish awards or grading certificates with consent checkboxes.
6. **Academy Information & Appearance:** Update story, phone, WhatsApp, address, social links, hero banners, academy logo, brand colours, and public fee visibility.
7. **Admissions & Enquiries:** Review applications, update status (`New → Contacted → Trial Scheduled → Approved / Waitlisted / Rejected`), and record internal follow-up notes.
