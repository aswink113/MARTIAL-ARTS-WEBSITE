from datetime import date, time
from io import BytesIO
from PIL import Image
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from core.models import SiteSettings, Banner
from core.validators import validate_safe_image
from courses.models import Course, Instructor, AgeCategory
from timetable.models import ClassSession
from admissions.models import AdmissionApplication
from gallery.models import GalleryCategory, GalleryItem
from achievements.models import Achievement

User = get_user_model()


class GreentrackWebsiteTests(TestCase):
    def setUp(self):
        self.settings = SiteSettings.objects.create(academy_name='Greentrack Martial Arts')
        self.banner = Banner.objects.create(title='Test Hero', subtitle='Karate & Boxing', is_active=True)
        self.age_kids = AgeCategory.objects.create(name='Kids', min_age=5, max_age=11)
        self.instructor = Instructor.objects.create(
            name='Sensei Kenji', role='Head Coach', is_head_coach=True,
            disciplines='Karate', qualifications='Level 4', experience='15 yrs', biography='Bio',
        )
        self.active_course = Course.objects.create(
            name='Karate Training', discipline='Karate', summary='Karate basics',
            description='Full desc', skills_covered='Stances\nBlocks',
            age_category=self.age_kids, age_group='Ages 5-11', is_active=True, is_featured=True,
        )
        self.inactive_course = Course.objects.create(
            name='Archived Class', discipline='Boxing', summary='Old',
            description='Desc', skills_covered='Jab', is_active=False,
        )
        self.session = ClassSession.objects.create(
            course=self.active_course, instructor=self.instructor, weekday=0,
            start_time=time(17, 0), end_time=time(18, 0), location='Main Mat', is_active=True,
        )
        cat = GalleryCategory.objects.create(name='Training Photos')
        GalleryItem.objects.create(
            category=cat, title='Training Session', minor_consent_verified=True, is_published=True,
        )
        Achievement.objects.create(
            title='Gold Cup', event_name='Open 2026', award='Gold', date=date(2026, 10, 1),
            description='Won gold', is_published=True,
        )
        self.admin_user = User.objects.create_user(
            'admin', password='Password123!', is_staff=True, is_superuser=True,
        )

    def test_public_pages_render_200(self):
        urls = [
            reverse('home'),
            reverse('course_list'),
            reverse('course_detail', args=[self.active_course.slug]),
            reverse('about'),
            reverse('gallery_list'),
            reverse('achievement_list'),
            reverse('timetable'),
            reverse('admission'),
            reverse('contact'),
            reverse('privacy'),
        ]
        for url in urls:
            res = self.client.get(url)
            self.assertEqual(res.status_code, 200, f'Failed URL: {url}')

    def test_admission_validation_minor_requires_guardian_and_consent(self):
        res = self.client.post(reverse('admission'), {
            'student_name': 'Young Learner',
            'date_of_birth': '2016-05-01',
            'guardian_name': '',
            'phone': '123',
            'course': self.active_course.pk,
            'experience': 'None / Complete Beginner',
            'consent_given': '',
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(AdmissionApplication.objects.count(), 0)

    def test_admission_rejects_inactive_course(self):
        res = self.client.post(reverse('admission'), {
            'student_name': 'Adult Student',
            'date_of_birth': '1995-05-01',
            'guardian_name': '',
            'phone': '+44 7700 900111',
            'course': self.inactive_course.pk,
            'experience': 'None / Complete Beginner',
            'consent_given': 'on',
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(AdmissionApplication.objects.count(), 0)

    def test_valid_admission_creates_unguessable_ref_and_hides_private_data(self):
        res = self.client.post(reverse('admission'), {
            'student_name': 'Private Applicant Name',
            'date_of_birth': '2015-04-10',
            'guardian_name': 'Parent Secret Name',
            'phone': '+44 7700 900123',
            'email': 'secret@example.com',
            'course': self.active_course.pk,
            'experience': 'None / Complete Beginner',
            'consent_given': 'on',
        })
        self.assertEqual(AdmissionApplication.objects.count(), 1)
        app = AdmissionApplication.objects.first()
        self.assertTrue(app.reference.startswith('GMA-'))
        self.assertRedirects(res, reverse('admission_success', args=[app.reference]))

        confirm_res = self.client.get(reverse('admission_success', args=[app.reference]))
        self.assertContains(confirm_res, app.reference)
        self.assertNotContains(confirm_res, 'Private Applicant Name')
        self.assertNotContains(confirm_res, 'Parent Secret Name')
        self.assertNotContains(confirm_res, '+44 7700 900123')
        self.assertNotContains(confirm_res, 'secret@example.com')

    def test_single_admin_panel_full_editing_access(self):
        # Unauthenticated visitors redirected to login
        res = self.client.get(reverse('academy_panel:overview'))
        self.assertEqual(res.status_code, 302)

        # Single admin logs in and can access every editing section
        self.client.login(username='admin', password='Password123!')
        admin_urls = [
            reverse('academy_panel:overview'),
            reverse('academy_panel:content_hub'),
            reverse('academy_panel:applications'),
            reverse('academy_panel:enquiries'),
            reverse('academy_panel:manage_courses'),
            reverse('academy_panel:manage_instructors'),
            reverse('academy_panel:manage_timetable'),
            reverse('academy_panel:manage_gallery'),
            reverse('academy_panel:manage_achievements'),
            reverse('academy_panel:manage_info'),
            reverse('academy_panel:manage_appearance'),
            reverse('academy_panel:account_settings'),
        ]
        for url in admin_urls:
            self.assertEqual(self.client.get(url).status_code, 200, f'Failed admin URL: {url}')

    def test_safe_image_validator(self):
        bad_file = SimpleUploadedFile('malware.exe', b'not-an-image', content_type='application/octet-stream')
        with self.assertRaises(ValidationError):
            validate_safe_image(bad_file)

        buf = BytesIO()
        Image.new('RGB', (20, 20), color='navy').save(buf, format='JPEG')
        buf.seek(0)
        good_file = SimpleUploadedFile('valid.jpg', buf.read(), content_type='image/jpeg')
        validate_safe_image(good_file)
