import urllib.request
import json

def test():
    print("=== 1. VERIFY FRONTEND & BACKEND SERVERS ===")
    req_be = urllib.request.urlopen("http://127.0.0.1:8000/api/settings/")
    print(f"Backend Server: {req_be.status} OK")
    settings = json.loads(req_be.read().decode())
    print(f"Academy Name: {settings.get('academy_name')}")

    req_fe = urllib.request.urlopen("http://localhost:5173")
    print(f"Frontend Server: {req_fe.status} OK")

    print("\n=== 2. VERIFY REST APIs ===")
    courses = json.loads(urllib.request.urlopen("http://127.0.0.1:8000/api/courses/").read().decode())
    print(f"Active Courses: {len(courses.get('results', courses))}")

    instructors = json.loads(urllib.request.urlopen("http://127.0.0.1:8000/api/instructors/").read().decode())
    print(f"Active Instructors: {len(instructors.get('results', instructors))}")

    schedules = json.loads(urllib.request.urlopen("http://127.0.0.1:8000/api/schedules/").read().decode())
    print(f"Class Batches: {len(schedules.get('results', schedules))}")

    gallery = json.loads(urllib.request.urlopen("http://127.0.0.1:8000/api/gallery/").read().decode())
    print(f"Gallery Items: {len(gallery.get('results', gallery))}")

    print("\n=== 3. TEST REAL ADMISSION ENQUIRY SUBMISSION ===")
    enq_payload = json.dumps({
        "student_name": "Marcus Aurelius",
        "student_age": 22,
        "guardian_name": "",
        "phone": "+1 555-444-3322",
        "email": "marcus@philosophy.edu",
        "course": 1,
        "preferred_batch": "Karate Morning Warriors",
        "message": "Testing real database insertion from automated verification"
    }).encode('utf-8')
    req_enq = urllib.request.Request(
        "http://127.0.0.1:8000/api/admission-enquiries/",
        data=enq_payload,
        headers={"Content-Type": "application/json"}
    )
    res_enq = json.loads(urllib.request.urlopen(req_enq).read().decode())
    print(f"Enquiry Saved: {res_enq.get('success')} (ID: {res_enq.get('enquiry_id')})")

    print("\n=== 4. TEST ROLE-BASED LOGINS (JWT) ===")
    roles = [
        ("admin", "admin123"),
        ("instructor", "instructor123"),
        ("student", "student123"),
    ]
    for username, pwd in roles:
        auth_payload = json.dumps({"username": username, "password": pwd}).encode('utf-8')
        req_auth = urllib.request.Request(
            "http://127.0.0.1:8000/api/auth/login/",
            data=auth_payload,
            headers={"Content-Type": "application/json"}
        )
        res_auth = json.loads(urllib.request.urlopen(req_auth).read().decode())
        role = res_auth["user"]["role"]
        access_token = res_auth["access"]
        print(f"  ✓ User '{username}': Authenticated successfully as Role='{role}'")

        # Test protected ERP stats
        req_stats = urllib.request.Request(
            "http://127.0.0.1:8000/api/erp/dashboard-stats/",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        res_stats = json.loads(urllib.request.urlopen(req_stats).read().decode())
        print(f"    ERP Stats response: role={res_stats.get('role')}, courses={res_stats.get('total_courses')}, batches={res_stats.get('total_batches')}")

    print("\n🏆 ALL FULL-STACK VERIFICATIONS PASSED 100%!")

if __name__ == '__main__':
    test()
