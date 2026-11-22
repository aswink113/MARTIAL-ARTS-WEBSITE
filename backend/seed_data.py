"""
Comprehensive data seeding script for Warrior Martial Arts Academy.
Populates courses, instructors, schedules, fees, gallery, achievements, settings,
Departments, Staff with Staff IDs, and Students with Student IDs for universal multi-identifier logins.
"""

import os
import django
from datetime import date, time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from academy.models import (
    AcademySettings,
    Course,
    Instructor,
    ClassSchedule,
    FeeInformation,
    GalleryItem,
    Achievement,
    AdmissionEnquiry
)
from erp.models import UserProfile, StudentMember, StaffMember, Department, Attendance

def run_seed():
    print("🥋 Starting Warrior Martial Arts Academy Data Seeding...")

    # 1. ACADEMY SETTINGS
    settings, _ = AcademySettings.objects.get_or_create(pk=1)
    settings.academy_name = "Warrior Martial Arts Academy"
    settings.logo_url = "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=300&q=80"
    settings.hero_banner_url = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1920&q=85"
    settings.academy_address = "123 Warrior Way, Martial City, NY 10001, USA"
    settings.contact_number = "+1 (123) 456-7890"
    settings.email = "info@warriormartialarts.com"
    settings.whatsapp_number = "+11234567890"
    settings.google_maps_url = "https://maps.google.com/?q=New+York+Martial+Arts"
    settings.instagram_url = "https://instagram.com/warriormartialarts"
    settings.facebook_url = "https://facebook.com/warriormartialarts"
    settings.academy_description = (
        "We empower individuals through martial arts training that builds strength, "
        "confidence, and character. From children learning life skills to adults achieving peak fitness, "
        "our traditional and modern disciplines prepare you for life's challenges."
    )
    settings.operating_hours = "Monday - Friday: 6:00 AM - 9:00 PM | Saturday: 8:00 AM - 2:00 PM | Sunday: Closed"
    settings.years_experience = "10+"
    settings.happy_students = "500+"
    settings.expert_instructors = "15+"
    settings.discipline_focus = "100%"
    settings.save()
    print("✅ Academy Settings seeded.")

    # 2. DEPARTMENTS
    dept_data = [
        {"name": "Traditional Karate & Kobudo", "code": "KARATE", "description": "Shotokan and traditional Japanese weapon katas."},
        {"name": "Combat Striking & Muay Thai", "code": "STRIKE", "description": "Boxing, Kickboxing, and full Thai striking syllabus."},
        {"name": "Brazilian Jiu-Jitsu & Grappling", "code": "BJJ", "description": "Gi and No-Gi Brazilian Jiu-Jitsu submission wrestling."},
        {"name": "Youth Development & Anti-Bullying", "code": "KIDS", "description": "Character building and physical education for children."},
        {"name": "Tactical Self-Defence & Krav Maga", "code": "TACTICAL", "description": "Real-world street scenario self-defense and threat neutralization."},
        {"name": "Dojo Operations & Admissions", "code": "OPS", "description": "Academy administration, member services, and billing."},
    ]
    dept_objs = {}
    for d in dept_data:
        obj, _ = Department.objects.update_or_create(code=d["code"], defaults=d)
        dept_objs[d["code"]] = obj
    print(f"✅ {len(dept_objs)} Departments seeded.")

    # 3. COURSES
    courses_data = [
        {
            "title": "Karate Training",
            "slug": "karate-training",
            "short_description": "Traditional Karate training for all ages focusing on discipline, kata, and strikes.",
            "description": "Our Karate program teaches authentic Japanese Shotokan techniques, powerful linear strikes, kicking combinations, and comprehensive kata.",
            "image_url": "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
            "age_group": "Ages 6 to Adults",
            "duration": "Ongoing / Belt Curriculum",
            "monthly_fee": 99.00,
            "display_order": 1
        },
        {
            "title": "Brazilian Jiu-Jitsu",
            "slug": "brazilian-jiu-jitsu",
            "short_description": "Ground fighting, joint locks, and submission grappling for control and leverage.",
            "description": "Known as the gentle art, Brazilian Jiu-Jitsu empowers smaller practitioners to defend against larger opponents using technique and leverage.",
            "image_url": "https://images.unsplash.com/photo-1517438322307-e67111335449?auto=format&fit=crop&w=800&q=80",
            "age_group": "Teens & Adults (13+)",
            "duration": "Year-round training",
            "monthly_fee": 119.00,
            "display_order": 2
        },
        {
            "title": "Muay Thai",
            "slug": "muay-thai",
            "short_description": "The art of eight limbs: devastating elbows, knees, kicks, and clinch control.",
            "description": "Master Thailand's legendary combat sport. Develop conditioning, explosive power, and precise striking using fists, elbows, knees, and shins.",
            "image_url": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
            "age_group": "Teens & Adults (14+)",
            "duration": "Ongoing Sessions",
            "monthly_fee": 109.00,
            "display_order": 3
        },
        {
            "title": "Kids Martial Arts",
            "slug": "kids-martial-arts",
            "short_description": "Fun, safe, and character-building classes fostering focus, respect, and confidence.",
            "description": "Designed specifically for children aged 5 to 12. We teach anti-bullying strategies, motor coordination, and teamwork in an encouraging environment.",
            "image_url": "https://images.unsplash.com/photo-1583473848882-f9a5bc7fd208?auto=format&fit=crop&w=800&q=80",
            "age_group": "Kids (Ages 5 - 12)",
            "duration": "Term & Annual Programs",
            "monthly_fee": 89.00,
            "display_order": 4
        },
        {
            "title": "Boxing & Kickboxing",
            "slug": "kickboxing-training",
            "short_description": "High-energy workout burning fat, sharpening reflexes, and boosting stamina.",
            "description": "Combine boxing fundamentals with dynamic kicks for athletic conditioning, stress relief, and stamina without mandatory sparring.",
            "image_url": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
            "age_group": "All Ages (12+)",
            "duration": "Ongoing / Open Enrollment",
            "monthly_fee": 95.00,
            "display_order": 5
        },
        {
            "title": "Self Defence & Krav Maga",
            "slug": "self-defence",
            "short_description": "Practical, instinctual techniques to protect yourself and loved ones in real situations.",
            "description": "Real-world tactical self-defense designed to neutralize threats quickly and escape safely. Includes situational awareness and escape drills.",
            "image_url": "https://images.unsplash.com/photo-1517438322307-e67111335449?auto=format&fit=crop&w=800&q=80",
            "age_group": "Adults & Teens (15+)",
            "duration": "12-Week Modules & Ongoing",
            "monthly_fee": 99.00,
            "display_order": 6
        }
    ]

    course_objs = {}
    for c_data in courses_data:
        course, _ = Course.objects.update_or_create(slug=c_data["slug"], defaults=c_data)
        course_objs[c_data["slug"]] = course
    print(f"✅ {len(course_objs)} Courses seeded.")

    # 4. INSTRUCTORS & PUBLIC PROFILES
    instructors_data = [
        {
            "name": "Master Kenji Tanaka",
            "designation": "Head Coach & Dojo Director",
            "biography": "Master Kenji began his journey at age 7 in Osaka. Over three decades of training have molded him into a revered instructor committed to passing on traditional values.",
            "qualifications": "6th Dan Black Belt Shotokan, Former All-Japan Kata Champion",
            "experience": "22+ Years",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
            "is_head_coach": True,
            "display_order": 1
        },
        {
            "name": "Professor Marcus Vance",
            "designation": "Head BJJ & Grappling Coach",
            "biography": "Professor Marcus is an IBJJF certified 3rd Degree Black Belt. He specializes in positional dominance, sweeps, and submissions for all body types.",
            "qualifications": "3rd Degree BJJ Black Belt, 2x Pan American Gold Medalist",
            "experience": "16+ Years",
            "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
            "is_head_coach": False,
            "display_order": 2
        },
        {
            "name": "Coach Sarah Jenkins",
            "designation": "Senior Striking & Muay Thai Coach",
            "biography": "Sarah is a decorated professional kickboxer and certified strength and conditioning coach blending authentic Thai technique with athletic science.",
            "qualifications": "WAKO Pro Kickboxing Champion, CSCS Certified Fitness Specialist",
            "experience": "12+ Years",
            "image_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
            "is_head_coach": False,
            "display_order": 3
        },
        {
            "name": "Sensei Elena Rostova",
            "designation": "Youth Programs & Self Defence Specialist",
            "biography": "Elena combines child psychology with martial arts excellence, creating an empowering space where young students cultivate respect and confidence.",
            "qualifications": "Black Belt Shotokan Karate, Certified Youth Athletic Coach",
            "experience": "10+ Years",
            "image_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
            "is_head_coach": False,
            "display_order": 4
        }
    ]
    for inst in instructors_data:
        Instructor.objects.update_or_create(name=inst["name"], defaults=inst)

    # 5. CLASS SCHEDULES
    schedules_data = [
        {"course_slug": "karate-training", "batch_name": "Karate Morning Warriors", "age_category": "Teens & Adults", "training_day": "Monday, Wednesday, Friday", "start_time": time(6, 30), "end_time": time(7, 30)},
        {"course_slug": "karate-training", "batch_name": "Karate Evening Katas", "age_category": "All Ages", "training_day": "Tuesday & Thursday", "start_time": time(18, 0), "end_time": time(19, 30)},
        {"course_slug": "brazilian-jiu-jitsu", "batch_name": "BJJ Fundamentals & Drilling", "age_category": "Adults (16+)", "training_day": "Monday, Wednesday, Friday", "start_time": time(19, 0), "end_time": time(20, 30)},
        {"course_slug": "muay-thai", "batch_name": "Muay Thai Power & Clinch", "age_category": "Teens & Adults", "training_day": "Tuesday, Thursday, Saturday", "start_time": time(17, 30), "end_time": time(19, 0)},
        {"course_slug": "kids-martial-arts", "batch_name": "Little Ninjas (Ages 5-8)", "age_category": "Kids (5-8)", "training_day": "Monday & Wednesday", "start_time": time(16, 0), "end_time": time(17, 0)},
        {"course_slug": "kickboxing-training", "batch_name": "Cardio Striking Morning", "age_category": "All Levels", "training_day": "Monday, Wednesday, Friday", "start_time": time(8, 0), "end_time": time(9, 0)},
        {"course_slug": "self-defence", "batch_name": "Tactical Self Defence Workshop", "age_category": "Teens & Adults", "training_day": "Saturday", "start_time": time(12, 30), "end_time": time(14, 0)},
    ]
    ClassSchedule.objects.all().delete()
    for sch in schedules_data:
        course = course_objs.get(sch.pop("course_slug"))
        if course:
            ClassSchedule.objects.create(course=course, **sch)
    print("✅ Class Schedules seeded.")

    # 6. USERS & STAFF MEMBERS (With Staff IDs & Multi-Identifier Logins)
    # A. Chief Administrator (Master Kenji)
    admin_user, _ = User.objects.get_or_create(username='admin', defaults={'email': 'admin@warriormartialarts.com', 'first_name': 'Kenji', 'last_name': 'Tanaka', 'is_staff': True, 'is_superuser': True})
    admin_user.set_password('admin123')
    admin_user.email = 'admin@warriormartialarts.com'
    admin_user.save()
    p_admin, _ = UserProfile.objects.get_or_create(user=admin_user)
    p_admin.role = 'admin'
    p_admin.custom_id = 'STF-001'
    p_admin.department = dept_objs["OPS"]
    p_admin.belt_rank = '6th Dan Black Belt'
    p_admin.phone = '+1 (123) 456-7890'
    p_admin.save()
    StaffMember.objects.update_or_create(
        staff_id='STF-001',
        defaults={
            'user': admin_user,
            'full_name': 'Master Kenji Tanaka',
            'department': dept_objs["OPS"],
            'designation': 'Dojo Director & Head Coach',
            'role_type': 'admin',
            'email': 'admin@warriormartialarts.com',
            'phone': '+1 (123) 456-7890',
            'salary': 7500.00
        }
    )

    # B. BJJ Head Coach (Marcus Vance)
    inst_user, _ = User.objects.get_or_create(username='instructor', defaults={'email': 'instructor@warriormartialarts.com', 'first_name': 'Marcus', 'last_name': 'Vance', 'is_staff': True})
    inst_user.set_password('instructor123')
    inst_user.email = 'instructor@warriormartialarts.com'
    inst_user.save()
    p_inst, _ = UserProfile.objects.get_or_create(user=inst_user)
    p_inst.role = 'instructor'
    p_inst.custom_id = 'STF-002'
    p_inst.department = dept_objs["BJJ"]
    p_inst.belt_rank = '3rd Degree Black Belt BJJ'
    p_inst.phone = '+1 (555) 987-6543'
    p_inst.save()
    StaffMember.objects.update_or_create(
        staff_id='STF-002',
        defaults={
            'user': inst_user,
            'full_name': 'Professor Marcus Vance',
            'department': dept_objs["BJJ"],
            'designation': 'Head Grappling & BJJ Sensei',
            'role_type': 'instructor',
            'email': 'instructor@warriormartialarts.com',
            'phone': '+1 (555) 987-6543',
            'salary': 5200.00
        }
    )

    # C. Striking Coach (Sarah Jenkins)
    sarah_user, _ = User.objects.get_or_create(username='STF-003', defaults={'email': 'sarah@warriormartialarts.com', 'first_name': 'Sarah', 'last_name': 'Jenkins', 'is_staff': True})
    sarah_user.set_password('sarah123')
    sarah_user.email = 'sarah@warriormartialarts.com'
    sarah_user.save()
    p_sarah, _ = UserProfile.objects.get_or_create(user=sarah_user)
    p_sarah.role = 'instructor'
    p_sarah.custom_id = 'STF-003'
    p_sarah.department = dept_objs["STRIKE"]
    p_sarah.belt_rank = '2nd Dan Black Belt Kickboxing'
    p_sarah.phone = '+1 (555) 321-7654'
    p_sarah.save()
    StaffMember.objects.update_or_create(
        staff_id='STF-003',
        defaults={
            'user': sarah_user,
            'full_name': 'Coach Sarah Jenkins',
            'department': dept_objs["STRIKE"],
            'designation': 'Senior Striking Coach',
            'role_type': 'instructor',
            'email': 'sarah@warriormartialarts.com',
            'phone': '+1 (555) 321-7654',
            'salary': 4800.00
        }
    )
    print("✅ 3 Staff Members with Staff IDs seeded.")

    # 7. STUDENTS (With Student IDs & Linked Login Accounts)
    karate_sched = ClassSchedule.objects.filter(course=course_objs["karate-training"]).first()
    bjj_sched = ClassSchedule.objects.filter(course=course_objs["brazilian-jiu-jitsu"]).first()

    # Student 1: Maya Patel (ID: STU-1001)
    stud_user1, _ = User.objects.get_or_create(username='student', defaults={'email': 'student@warriormartialarts.com', 'first_name': 'Maya', 'last_name': 'Patel'})
    stud_user1.set_password('student123')
    stud_user1.email = 'student@warriormartialarts.com'
    stud_user1.save()
    p_stud1, _ = UserProfile.objects.get_or_create(user=stud_user1)
    p_stud1.role = 'student'
    p_stud1.custom_id = 'STU-1001'
    p_stud1.department = dept_objs["KARATE"]
    p_stud1.belt_rank = 'Green Belt'
    p_stud1.phone = '+1 (555) 567-8901'
    p_stud1.save()

    StudentMember.objects.update_or_create(
        user=stud_user1,
        defaults={
            'student_id': 'STU-1001',
            'full_name': 'Maya Patel',
            'department': dept_objs["KARATE"],
            'course': course_objs["karate-training"],
            'batch': karate_sched,
            'guardian_name': 'Raj Patel',
            'phone': '+1 (555) 567-8901',
            'email': 'student@warriormartialarts.com',
            'current_belt': 'Green Belt',
            'fee_status': 'Paid',
            'date_of_birth': date(2010, 4, 12),
        }
    )

    # Student 2: Alexander Cole (ID: STU-1002)
    stud_user2, _ = User.objects.get_or_create(username='STU-1002', defaults={'email': 'alex.c@example.com', 'first_name': 'Alexander', 'last_name': 'Cole'})
    stud_user2.set_password('alex123')
    stud_user2.email = 'alex.c@example.com'
    stud_user2.save()
    p_stud2, _ = UserProfile.objects.get_or_create(user=stud_user2)
    p_stud2.role = 'student'
    p_stud2.custom_id = 'STU-1002'
    p_stud2.department = dept_objs["BJJ"]
    p_stud2.belt_rank = 'Blue Belt'
    p_stud2.save()

    StudentMember.objects.update_or_create(
        user=stud_user2,
        defaults={
            'student_id': 'STU-1002',
            'full_name': 'Alexander Cole',
            'department': dept_objs["BJJ"],
            'course': course_objs["brazilian-jiu-jitsu"],
            'batch': bjj_sched,
            'phone': '+1 (555) 111-2222',
            'email': 'alex.c@example.com',
            'current_belt': 'Blue Belt',
            'fee_status': 'Paid',
        }
    )

    # Student 3: Jessica Taylor (ID: STU-1003)
    stud_user3, _ = User.objects.get_or_create(username='STU-1003', defaults={'email': 'jessica.t@example.com', 'first_name': 'Jessica', 'last_name': 'Taylor'})
    stud_user3.set_password('jessica123')
    stud_user3.email = 'jessica.t@example.com'
    stud_user3.save()
    p_stud3, _ = UserProfile.objects.get_or_create(user=stud_user3)
    p_stud3.role = 'student'
    p_stud3.custom_id = 'STU-1003'
    p_stud3.department = dept_objs["STRIKE"]
    p_stud3.belt_rank = 'White Belt'
    p_stud3.save()

    StudentMember.objects.update_or_create(
        user=stud_user3,
        defaults={
            'student_id': 'STU-1003',
            'full_name': 'Jessica Taylor',
            'department': dept_objs["STRIKE"],
            'course': course_objs["muay-thai"],
            'phone': '+1 (555) 333-4444',
            'email': 'jessica.t@example.com',
            'current_belt': 'White Belt',
            'fee_status': 'Due',
        }
    )
    print("✅ Students with Student IDs (STU-1001, STU-1002, STU-1003) seeded.")

    # 8. ADMISSION ENQUIRIES
    AdmissionEnquiry.objects.all().delete()
    AdmissionEnquiry.objects.create(
        student_name="Liam Henderson",
        student_age=8,
        guardian_name="Claire Henderson",
        phone="+1 (555) 234-5678",
        email="claire.h@example.com",
        course=course_objs["kids-martial-arts"],
        preferred_batch="Little Ninjas",
        message="Liam is 8 years old and wants to start training!",
        enquiry_status="New"
    )

    print("✨ Comprehensive data seeding finished successfully!")

if __name__ == '__main__':
    run_seed()
