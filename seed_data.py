"""
Initial database seeding script for Greentrack Martial Arts.
Populates academy settings, banners, age categories, instructors, courses,
weekly timetable, gallery items, achievements, sample applications, and the single admin account.
"""

import os
import django
from datetime import date, time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import SiteSettings, Banner, GeneralEnquiry
from courses.models import AgeCategory, Instructor, Course
from timetable.models import ClassSession
from admissions.models import AdmissionApplication, ApplicationNote
from gallery.models import GalleryCategory, GalleryItem
from achievements.models import Achievement
from academy_panel.models import StaffRoleProfile

User = get_user_model()


def run_seed():
    print('Seeding Greentrack Martial Arts database...')

    # 1. Site Settings
    SiteSettings.objects.all().delete()
    SiteSettings.objects.create(
        academy_name='Greentrack Martial Arts',
        tagline='Build Strength. Discipline. Confidence.',
        phone='+91 98765 43210',
        whatsapp='919876543210',
        email='admissions@greentrackmartialarts.in',
        address='42 Greentrack Dojo, 100 Feet Road, Indiranagar, Bengaluru 560038',
        opening_hours='Mon–Fri: 6:00 AM – 9:00 PM | Sat–Sun: 7:30 AM – 4:00 PM',
        map_url='https://maps.google.com/?q=Indiranagar+Bengaluru',
        instagram_url='https://instagram.com/',
        facebook_url='https://facebook.com/',
        primary_color='#14243A',
        action_color='#D83A3A',
        accent_color='#E6A23C',
        show_fees_publicly=True,
        founded_year=2014,
        academy_story=(
            'Founded in 2014, Greentrack Martial Arts was built with a clear mission: to offer '
            'authentic, structured martial arts education in a safe, clean, and welcoming environment '
            'for children, teenagers, and adults.\n\n'
            'Our academy unites traditional Shotokan Karate, technical Boxing, and Kung Fu fundamentals '
            'with clear progression pathways, attentive instructor supervision, and strong community values.'
        ),
        training_philosophy=(
            'Every student progresses through clear technical standards built around respect, discipline, '
            'physical conditioning, and practical confidence. We never rush belt promotions; instead, '
            'we coach every student individually to earn their progress safely and proudly.'
        ),
        footer_text='Structured Karate, Boxing, Kung Fu, and practical Self-Defence training for ages 5 to adult.',
    )

    # 2. Hero Banner
    Banner.objects.all().delete()
    Banner.objects.create(
        title='Build Strength. Discipline. Confidence.',
        subtitle=(
            'Structured training in Karate, Boxing, and Kung Fu for children, teens, and adults — '
            'guided by qualified black-belt instructors in a safe, supportive dojo.'
        ),
        proof_point='Established 2014 • Qualified Coaches • Ages 5 to Adult',
        image='banners/hero-dojo.jpg',
        button_text='Join Now',
        button_url='/admission/',
        secondary_button_text='Explore Courses',
        secondary_button_url='/courses/',
        sort_order=1,
        is_active=True,
    )

    # Clear protected AdmissionApplications first when re-seeding
    AdmissionApplication.objects.all().delete()

    # 3. Age Categories
    AgeCategory.objects.all().delete()
    age_kids = AgeCategory.objects.create(
        name='Kids', min_age=5, max_age=11,
        description='Balance, focus, coordination, and foundational martial arts.', sort_order=1,
    )
    age_teens = AgeCategory.objects.create(
        name='Teens', min_age=12, max_age=17,
        description='Discipline, fitness, technical sparring, and confidence.', sort_order=2,
    )
    age_adults = AgeCategory.objects.create(
        name='Adults', min_age=18, max_age=65,
        description='Conditioning, striking skills, self-defence, and belt mastery.', sort_order=3,
    )
    age_all = AgeCategory.objects.create(
        name='Youth & Adults', min_age=12, max_age=65,
        description='Combined progressive classes for teens and adults.', sort_order=4,
    )

    # 4. Instructors
    Instructor.objects.all().delete()
    head_coach = Instructor.objects.create(
        name='Sensei Kenji Sato',
        role='Head Coach & Academy Director',
        is_head_coach=True,
        photo='instructors/head-coach.jpg',
        disciplines='Shotokan Karate, Self-Defence',
        rank_grade='5th Dan Black Belt',
        qualifications='Level 4 Martial Arts Coaching Diploma, Enhanced DBS & First Aid Certified',
        experience='16+ Years Coaching Experience',
        biography=(
            'Head Coach Kenji Sato founded Greentrack Martial Arts in 2014 after competing and coaching '
            'at national level. Known for calm, structured instruction, he oversees academy safety, '
            'grading standards, and youth development across all disciplines.'
        ),
        sort_order=1,
    )
    coach_elena = Instructor.objects.create(
        name='Coach Elena Vance',
        role='Senior Karate & Youth Instructor',
        is_head_coach=False,
        photo='instructors/female-instructor.jpg',
        disciplines='Karate, Kids Martial Arts',
        rank_grade='3rd Dan Black Belt',
        qualifications='Certified Youth Safeguarding Lead, BSc Sports Coaching',
        experience='9 Years Coaching Experience',
        biography=(
            'Elena leads our Kids Martial Arts and beginner Karate programmes, helping young learners '
            'develop focus, posture, respect, and steady confidence on and off the mats.'
        ),
        sort_order=2,
    )
    coach_marcus = Instructor.objects.create(
        name='Coach Marcus Reid',
        role='Head Boxing & Conditioning Coach',
        is_head_coach=False,
        photo='courses/boxing-training.jpg',
        disciplines='Boxing, Adult Fitness & Self-Defence',
        rank_grade='England Boxing Level 2 Coach',
        qualifications='ABA Registered Boxing Coach, Strength & Conditioning Specialist',
        experience='11 Years Ring & Coaching Experience',
        biography=(
            'Marcus directs our technical Boxing and adult conditioning sessions, emphasising clean '
            'footwork, defensive guard mechanics, pad work, and safe controlled drills.'
        ),
        sort_order=3,
    )

    # 5. Courses
    Course.objects.all().delete()
    c_karate = Course.objects.create(
        name='Karate Training',
        slug='karate-training',
        discipline='Karate',
        summary='Traditional Shotokan Karate building crisp technique, balance, self-control, and belt progression.',
        description=(
            'Our Karate programme follows a clear syllabus from white belt fundamentals through to '
            'black-belt mastery. Students learn stance work, blocking, strikes, kata (forms), and '
            'controlled partner drills in a respectful, focused setting.'
        ),
        skills_covered=(
            'Foundational stances, balance and footwork\n'
            'Traditional blocks, strikes and kicking accuracy\n'
            'Structured kata forms and grading preparation\n'
            'Controlled non-contact and light-contact partner drills\n'
            'Respect, etiquette and calm focus under pressure'
        ),
        prerequisites='Open to beginners and graded students. Comfortable sportswear required for trial.',
        image='courses/karate-training.jpg',
        age_category=age_all,
        age_group='Ages 12+ & Adults',
        level='All Levels',
        class_frequency='3 Sessions / Week',
        duration='60 Minutes',
        fee='1800.00',
        currency='₹',
        fee_period='per month',
        instructor=head_coach,
        is_featured=True,
        sort_order=1,
    )

    c_boxing = Course.objects.create(
        name='Boxing Training',
        slug='boxing-training',
        discipline='Boxing',
        summary='Technical footwork, jab-cross combinations, defensive guard, heavy bag work, and athletic conditioning.',
        description=(
            'Designed for fitness enthusiasts and aspiring boxers alike, our Boxing classes teach '
            'authentic ring fundamentals without intimidating environments. Sessions combine shadowboxing, '
            'pad work, bag rounds, and high-energy conditioning.'
        ),
        skills_covered=(
            'Boxing stance, footwork and distance control\n'
            'Clean punching mechanics and combinations\n'
            'Head movement, slipping and defensive guard\n'
            'Heavy bag intervals and coach-led pad work\n'
            'Cardiovascular stamina and core strength'
        ),
        prerequisites='Hand wraps recommended after trial. Loan gloves available for introductory sessions.',
        image='courses/boxing-training.jpg',
        age_category=age_all,
        age_group='Ages 14+ & Adults',
        level='Beginner',
        class_frequency='3 Sessions / Week',
        duration='60 Minutes',
        fee='2000.00',
        currency='₹',
        fee_period='per month',
        instructor=coach_marcus,
        is_featured=True,
        sort_order=2,
    )

    c_kungfu = Course.objects.create(
        name='Kung Fu Training',
        slug='kung-fu-training',
        discipline='Kung Fu',
        summary='Fluid traditional Kung Fu combining agility, deep stances, flexibility, and coordinated striking.',
        description=(
            'Our Kung Fu curriculum develops whole-body coordination, joint mobility, and flowing '
            'defensive-to-offensive transitions. Ideal for students seeking traditional martial artistry '
            'alongside practical agility and posture.'
        ),
        skills_covered=(
            'Low stance stability and leg conditioning\n'
            'Traditional hand forms and flowing combinations\n'
            'Flexibility, balance and breathing control\n'
            'Partner sensitivity and deflection drills'
        ),
        prerequisites='Suitable for beginners; no prior flexibility or martial arts background needed.',
        image='courses/kungfu-training.jpg',
        age_category=age_all,
        age_group='Ages 12+ & Adults',
        level='All Levels',
        class_frequency='2 Sessions / Week',
        duration='60 Minutes',
        fee='1900.00',
        currency='₹',
        fee_period='per month',
        instructor=head_coach,
        is_featured=True,
        sort_order=3,
    )

    c_kids = Course.objects.create(
        name='Kids Martial Arts',
        slug='kids-martial-arts',
        discipline='Kids Martial Arts',
        summary='Safe, energetic classes helping children ages 5–11 build focus, respect, listening skills, and confidence.',
        description=(
            'Specially tailored for young learners, our Kids Martial Arts classes blend structured '
            'Karate basics with coordination games, anti-bullying awareness, and positive reinforcement '
            'so children thrive both in school and at home.'
        ),
        skills_covered=(
            'Listening skills, focus and classroom discipline\n'
            'Balance, agility and spatial coordination\n'
            'Age-appropriate blocks, stances and pad kicks\n'
            'Anti-bullying posture and verbal confidence\n'
            'Goal-setting through junior belt stripes'
        ),
        prerequisites='Ages 5–11. Parent or guardian registration required.',
        image='courses/kids-martial-arts.jpg',
        age_category=age_kids,
        age_group='Ages 5–11',
        level='Beginner',
        class_frequency='2 Sessions / Week',
        duration='45 Minutes',
        fee='1500.00',
        currency='₹',
        fee_period='per month',
        instructor=coach_elena,
        is_featured=False,
        sort_order=4,
    )

    c_adult = Course.objects.create(
        name='Adult Training & Conditioning',
        slug='adult-training',
        discipline='Adult Training',
        summary='High-value evening training combining striking fundamentals, fitness conditioning, and technical sparring.',
        description=(
            'Tailored for adults returning to fitness or starting martial arts from scratch. Build '
            'strength, stamina, and crisp striking habits alongside welcoming training partners.'
        ),
        skills_covered=(
            'Full-body warmups and athletic mobility\n'
            'Strikes, kicks and defensive reactions\n'
            'Pad circuits and progressive fitness benchmarks\n'
            'Optional controlled technical sparring'
        ),
        prerequisites='Ages 18+. All fitness levels welcome.',
        image='courses/karate-training.jpg',
        age_category=age_adults,
        age_group='Ages 18+',
        level='All Levels',
        class_frequency='3 Sessions / Week',
        duration='60 Minutes',
        fee='2200.00',
        currency='₹',
        fee_period='per month',
        instructor=coach_marcus,
        is_featured=False,
        sort_order=5,
    )

    c_selfdef = Course.objects.create(
        name='Practical Self Defence',
        slug='self-defence',
        discipline='Self Defence',
        summary='Scenario-based personal safety, situational awareness, boundary setting, and controlled escape mechanics.',
        description=(
            'Focused purely on real-world personal safety rather than tournament rules. Learn awareness, '
            'de-escalation, balance recovery, wrist/grip releases, and simple high-percentage defensive techniques.'
        ),
        skills_covered=(
            'Situational awareness and verbal boundary setting\n'
            'Wrist, clothing and hold escape mechanics\n'
            'Maintaining balance and creating safe distance\n'
            'Simple, high-percentage defensive strikes'
        ),
        prerequisites='Ages 16+. Suitable for complete beginners.',
        image='courses/self-defence.jpg',
        age_category=age_adults,
        age_group='Ages 16+ & Adults',
        level='Beginner',
        class_frequency='2 Sessions / Week',
        duration='60 Minutes',
        fee='1800.00',
        currency='₹',
        fee_period='per month',
        instructor=head_coach,
        is_featured=False,
        sort_order=6,
    )

    # 6. Weekly Timetable
    ClassSession.objects.all().delete()
    sessions_data = [
        (c_kids, coach_elena, 0, time(16, 30), time(17, 15), age_kids, 'Ages 5–11', 'Main Dojo Mat', 18),
        (c_karate, head_coach, 0, time(18, 0), time(19, 0), age_all, 'Ages 12+ & Adults', 'Main Dojo Mat', 24),
        (c_boxing, coach_marcus, 0, time(19, 15), time(20, 15), age_all, 'Ages 14+ & Adults', 'Boxing Studio', 20),

        (c_kungfu, head_coach, 1, time(18, 0), time(19, 0), age_all, 'Ages 12+ & Adults', 'Main Dojo Mat', 20),
        (c_selfdef, head_coach, 1, time(19, 15), time(20, 15), age_adults, 'Ages 16+ & Adults', 'Main Dojo Mat', 16),

        (c_kids, coach_elena, 2, time(16, 30), time(17, 15), age_kids, 'Ages 5–11', 'Main Dojo Mat', 18),
        (c_karate, head_coach, 2, time(18, 0), time(19, 0), age_all, 'Ages 12+ & Adults', 'Main Dojo Mat', 24),
        (c_adult, coach_marcus, 2, time(19, 15), time(20, 15), age_adults, 'Ages 18+', 'Boxing Studio', 20),

        (c_boxing, coach_marcus, 3, time(18, 0), time(19, 0), age_all, 'Ages 14+ & Adults', 'Boxing Studio', 20),
        (c_kungfu, head_coach, 3, time(19, 15), time(20, 15), age_all, 'Ages 12+ & Adults', 'Main Dojo Mat', 20),

        (c_karate, coach_elena, 4, time(17, 30), time(18, 30), age_teens, 'Ages 12–17', 'Main Dojo Mat', 20),
        (c_selfdef, head_coach, 4, time(18, 45), time(19, 45), age_adults, 'Ages 16+ & Adults', 'Main Dojo Mat', 16),

        (c_kids, coach_elena, 5, time(9, 30), time(10, 15), age_kids, 'Ages 5–11', 'Main Dojo Mat', 20),
        (c_boxing, coach_marcus, 5, time(10, 30), time(11, 30), age_all, 'Ages 14+ & Adults', 'Boxing Studio', 20),
        (c_adult, head_coach, 5, time(11, 45), time(12, 45), age_adults, 'Ages 18+', 'Main Dojo Mat', 22),
    ]
    for course, inst, wd, st, et, ac, ag, loc, cap in sessions_data:
        ClassSession.objects.create(
            course=course, instructor=inst, weekday=wd, start_time=st, end_time=et,
            age_category=ac, age_group=ag, location=loc, capacity=cap, is_active=True,
        )

    # 7. Gallery Categories & Items
    GalleryCategory.objects.all().delete()
    cat_training = GalleryCategory.objects.create(name='Training Photos', slug='training-photos', sort_order=1)
    GalleryCategory.objects.create(name='Competition Photos', slug='competition-photos', sort_order=2)
    cat_certs = GalleryCategory.objects.create(name='Certificates & Awards', slug='certificates-awards', sort_order=3)
    GalleryCategory.objects.create(name='Videos', slug='videos', sort_order=4)

    GalleryItem.objects.all().delete()
    GalleryItem.objects.create(
        category=cat_training, media_type='photo', title='Evening Shotokan Karate Technique',
        image='gallery/gallery-karate.jpg', caption='Focused stance and strike drills on the main dojo floor.',
        event_date=date(2026, 9, 14), minor_consent_verified=True, is_published=True,
    )
    GalleryItem.objects.create(
        category=cat_training, media_type='photo', title='Heavy Bag Conditioning Session',
        image='gallery/gallery-boxing.jpg', caption='Technical boxing bag rounds focusing on jab speed and footwork.',
        event_date=date(2026, 10, 2), minor_consent_verified=True, is_published=True,
    )
    GalleryItem.objects.create(
        category=cat_training, media_type='photo', title='Traditional Kung Fu Stance Mastery',
        image='gallery/gallery-kungfu.jpg', caption='Low bow-stance balance and precision palm strike.',
        event_date=date(2026, 10, 12), minor_consent_verified=True, is_published=True,
    )
    GalleryItem.objects.create(
        category=cat_training, media_type='photo', title='Junior Ninjas Saturday Morning Class',
        image='gallery/gallery-kids.jpg', caption='Young students practicing disciplined rising blocks (guardian consent verified).',
        event_date=date(2026, 10, 19), minor_consent_verified=True, is_published=True,
    )
    GalleryItem.objects.create(
        category=cat_training, media_type='photo', title='Adult Practical Self-Defence Workshop',
        image='gallery/gallery-selfdefence.jpg', caption='Controlled wrist-release mechanics and safe posture drills.',
        event_date=date(2026, 10, 26), minor_consent_verified=True, is_published=True,
    )
    GalleryItem.objects.create(
        category=cat_certs, media_type='photo', title='Autumn Black-Belt Grading & Trophy Presentation',
        image='gallery/gallery-awards.jpg', caption='Official grading certificates and regional tournament medals.',
        event_date=date(2026, 11, 5), minor_consent_verified=True, is_published=True,
    )

    # 8. Achievements
    Achievement.objects.all().delete()
    Achievement.objects.create(
        title='Regional Open Karate Kata Gold Medal',
        event_name='Bengaluru Inter-Academy Karate Open 2026',
        award='Gold Medal — Team Kata',
        person_or_team='Greentrack Senior Squad',
        consent_confirmed=True,
        date=date(2026, 10, 18),
        description='Awarded first place in synchronised team kata across 18 competing regional dojos.',
        certificate_image='achievements/championship-awards.jpg',
        is_published=True,
    )
    Achievement.objects.create(
        title='Autumn Dan & Kyu Grading Certification',
        event_name='Greentrack Annual Grading Examination',
        award='Shodan Black Belt Certifications',
        person_or_team='Graduating Senior Cohort',
        consent_confirmed=True,
        date=date(2026, 9, 28),
        description='Six academy students completed their technical, kata, and sparring assessments to earn Dan grading recognition.',
        certificate_image='achievements/championship-awards.jpg',
        is_published=True,
    )
    Achievement.objects.create(
        title='Youth Safeguarding & Coaching Excellence Award',
        event_name='Community Sports Quality Mark',
        award='Gold Standard Recognition',
        person_or_team='Greentrack Coaching Team',
        consent_confirmed=True,
        date=date(2025, 11, 12),
        description='Recognised for structured child safeguarding, clean training facilities, and inclusive youth coaching.',
        certificate_image='achievements/championship-awards.jpg',
        is_published=True,
    )

    # 9. Sample Admission Applications & General Enquiries
    AdmissionApplication.objects.all().delete()
    AdmissionApplication.objects.create(
        student_name='Aarav Nair',
        date_of_birth=date(2017, 5, 14),
        guardian_name='Meera Nair',
        phone='+91 98450 11223',
        email='meera.nair@example.in',
        course=c_kids,
        preferred_time='Saturday Morning (9:30 AM)',
        experience='None / Complete Beginner',
        message='Aarav is 9 years old and eager to build confidence and focus.',
        consent_given=True,
        status='New',
    )
    app2 = AdmissionApplication.objects.create(
        student_name='Rohan Kulkarni',
        date_of_birth=date(1999, 8, 22),
        guardian_name='',
        phone='+91 98801 44556',
        email='rohan.k@example.in',
        course=c_boxing,
        preferred_time='Monday & Thursday Evenings',
        experience='Less than 1 Year',
        message='Interested in learning proper boxing fundamentals and fitness.',
        consent_given=True,
        status='Trial Scheduled',
    )

    GeneralEnquiry.objects.all().delete()
    GeneralEnquiry.objects.create(
        name='Priya Sharma',
        phone='+91 99001 77889',
        email='priya.s@example.in',
        subject='Trial uniform question',
        message='Do beginners need to purchase a gi before their first introductory trial class?',
        status='New',
    )

    # 10. Single Academy Admin Account (Remove any extra role accounts)
    User.objects.exclude(username='admin').delete()
    StaffRoleProfile.objects.all().delete()

    admin_user, _ = User.objects.get_or_create(username='admin', defaults={
        'first_name': 'Academy',
        'last_name': 'Admin',
        'email': 'admin@greentrackmartialarts.com',
        'is_staff': True,
        'is_superuser': True,
        'is_active': True,
    })
    admin_user.first_name = 'Academy'
    admin_user.last_name = 'Admin'
    admin_user.email = 'admin@greentrackmartialarts.com'
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.is_active = True
    admin_user.set_password('Greentrack@2026')
    admin_user.save()

    ApplicationNote.objects.create(
        application=app2,
        author=admin_user,
        note='Spoke by phone; trial booked for Thursday 6:00 PM Boxing studio.',
        follow_up_at=date(2026, 11, 28),
    )

    print('Seeding complete! Single Academy Admin login ready (admin / Greentrack@2026).')


if __name__ == '__main__':
    run_seed()
