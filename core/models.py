from django.db import models
from .validators import validate_safe_image


class SiteSettings(models.Model):
    """Global configurable academy settings, branding, contact and theme options."""

    academy_name = models.CharField(max_length=150, default='Greentrack Martial Arts')
    tagline = models.CharField(
        max_length=200,
        default='Build Strength. Discipline. Confidence.',
    )
    logo = models.ImageField(
        upload_to='branding/',
        blank=True,
        null=True,
        validators=[validate_safe_image],
    )
    phone = models.CharField(max_length=40, default='+91 98765 43210')
    whatsapp = models.CharField(
        max_length=40,
        default='919876543210',
        help_text='Digits with country code, no + or spaces (used for WhatsApp click-to-chat).',
    )
    email = models.EmailField(default='admissions@greentrackmartialarts.in')
    address = models.TextField(
        default='42 Greentrack Dojo, 100 Feet Road, Indiranagar, Bengaluru 560038',
    )
    opening_hours = models.CharField(
        max_length=200,
        default='Mon–Fri: 6:00 AM – 9:00 PM | Sat–Sun: 7:30 AM – 4:00 PM',
    )
    map_url = models.URLField(
        blank=True,
        default='https://maps.google.com/?q=Indiranagar+Bengaluru',
        help_text='Verified Google Maps directions link.',
    )
    map_embed_url = models.URLField(
        blank=True,
        default='',
        help_text='Optional Google Maps embed iframe URL.',
    )
    instagram_url = models.URLField(blank=True, default='https://instagram.com/')
    facebook_url = models.URLField(blank=True, default='https://facebook.com/')
    youtube_url = models.URLField(blank=True, default='')

    # Brand & Theme Settings (Blueprint Section 3 & 11)
    primary_color = models.CharField(max_length=20, default='#14243A')
    action_color = models.CharField(max_length=20, default='#D83A3A')
    accent_color = models.CharField(max_length=20, default='#E6A23C')
    show_fees_publicly = models.BooleanField(
        default=True,
        help_text='Show monthly course fees on Courses and Timetable pages.',
    )

    # About & Philosophy
    founded_year = models.PositiveIntegerField(default=2014)
    academy_story = models.TextField(
        default=(
            'Founded in 2014, Greentrack Martial Arts was established to provide structured, '
            'safe, and welcoming martial arts education for children, teens, and adults. '
            'Our academy blends traditional martial values—respect, self-control, and perseverance—with '
            'modern coaching science.'
        ),
    )
    training_philosophy = models.TextField(
        default=(
            'Every student progresses at a clear, structured pace built on safety, technical mastery, '
            'physical conditioning, and mental confidence. Whether stepping onto the mats for fitness, '
            'personal safety, or tournament competition, our instructors guide each learner personally.'
        ),
    )
    footer_text = models.CharField(
        max_length=255,
        default='Structured Karate, Boxing, Kung Fu, and practical Self-Defence training for all ages.',
    )
    privacy_notice = models.TextField(
        default=(
            'Greentrack Martial Arts collects admission and enquiry details solely to respond to your '
            'training request, schedule trial assessments, and manage academy enrolment. Minor applicant '
            'information requires parent or guardian consent. Personal data is restricted to authorised '
            'academy staff, never sold or exposed publicly, and retained only as long as necessary for '
            'enrolment or legal compliance. To request data deletion, contact our academy office.'
        ),
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Academy Information'
        verbose_name_plural = 'Academy Information'

    def __str__(self):
        return self.academy_name


class Banner(models.Model):
    """Hero banner slides displayed on the home page."""

    title = models.CharField(max_length=160)
    subtitle = models.CharField(max_length=280)
    proof_point = models.CharField(
        max_length=120,
        blank=True,
        help_text='Verified badge/stat, e.g. "Certified Coaches • Ages 5 to Adult".',
    )
    image = models.ImageField(
        upload_to='banners/',
        blank=True,
        null=True,
        validators=[validate_safe_image],
    )
    button_text = models.CharField(max_length=50, default='Join Now')
    button_url = models.CharField(max_length=200, default='/admission/')
    secondary_button_text = models.CharField(max_length=50, default='Explore Courses')
    secondary_button_url = models.CharField(max_length=200, default='/courses/')
    sort_order = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', '-created_at']
        verbose_name = 'Home Banner'
        verbose_name_plural = 'Home Banners'

    def __str__(self):
        return self.title


class GeneralEnquiry(models.Model):
    """General contact enquiry form submissions (separate from formal admissions)."""

    STATUS_CHOICES = [
        ('New', 'New'),
        ('Replied', 'Replied'),
        ('Resolved', 'Resolved'),
    ]

    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    subject = models.CharField(max_length=150)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    staff_notes = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'General Enquiry'
        verbose_name_plural = 'General Enquiries'
        indexes = [models.Index(fields=['status', '-submitted_at'])]

    def __str__(self):
        return f'{self.name} — {self.subject}'
