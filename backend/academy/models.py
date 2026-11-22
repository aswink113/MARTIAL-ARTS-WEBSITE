from django.db import models
from django.utils.text import slugify

class AcademySettings(models.Model):
    academy_name = models.CharField(max_length=200, default="Warrior Martial Arts Academy")
    academy_logo = models.ImageField(upload_to='branding/', blank=True, null=True)
    logo_url = models.URLField(blank=True, default='')
    hero_banner = models.ImageField(upload_to='branding/', blank=True, null=True)
    hero_banner_url = models.URLField(blank=True, default='')
    academy_address = models.TextField(default="123 Warrior Way, Martial City, NY 10001, USA")
    contact_number = models.CharField(max_length=30, default="+1 (123) 456-7890")
    email = models.EmailField(default="info@warriormartialarts.com")
    whatsapp_number = models.CharField(max_length=30, default="+11234567890")
    google_maps_url = models.URLField(blank=True, default="https://maps.google.com/?q=Martial+Arts+Academy")
    instagram_url = models.URLField(blank=True, default="https://instagram.com/warriormartialarts")
    facebook_url = models.URLField(blank=True, default="https://facebook.com/warriormartialarts")
    academy_description = models.TextField(
        default="Empowering individuals of all ages through disciplined martial arts training, physical fitness, mental sharpness, and an unbreakable warrior spirit."
    )
    operating_hours = models.CharField(
        max_length=250, 
        default="Mon - Fri: 6:00 AM - 9:00 PM | Sat: 8:00 AM - 2:00 PM | Sun: Closed"
    )
    years_experience = models.CharField(max_length=20, default="10+")
    happy_students = models.CharField(max_length=20, default="500+")
    expert_instructors = models.CharField(max_length=20, default="15+")
    discipline_focus = models.CharField(max_length=20, default="100%")

    class Meta:
        verbose_name = "Academy Setting"
        verbose_name_plural = "Academy Settings"

    def __str__(self):
        return self.academy_name

    def save(self, *args, **kwargs):
        # Enforce singleton pattern: only one instance allowed
        if not self.pk and AcademySettings.objects.exists():
            return AcademySettings.objects.first()
        return super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class Course(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    short_description = models.CharField(max_length=300)
    description = models.TextField()
    image = models.ImageField(upload_to='courses/', blank=True, null=True)
    image_url = models.URLField(blank=True, default='')
    age_group = models.CharField(max_length=100, default="All Ages (6+)")
    duration = models.CharField(max_length=100, default="Ongoing / Flexible")
    monthly_fee = models.DecimalField(max_digits=10, decimal_places=2, default=99.00)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', 'title']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Course.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


class Instructor(models.Model):
    name = models.CharField(max_length=150)
    designation = models.CharField(max_length=150)
    biography = models.TextField()
    qualifications = models.TextField(help_text="Certifications, Dan belts, titles")
    experience = models.CharField(max_length=100, default="10+ Years")
    profile_image = models.ImageField(upload_to='instructors/', blank=True, null=True)
    image_url = models.URLField(blank=True, default='')
    is_head_coach = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_head_coach', 'display_order', 'name']

    def __str__(self):
        return f"{self.name} ({'Head Coach' if self.is_head_coach else self.designation})"


class ClassSchedule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='schedules')
    batch_name = models.CharField(max_length=120)
    age_category = models.CharField(max_length=100, default="Teens & Adults")
    training_day = models.CharField(max_length=100, help_text="e.g. Mon, Wed, Fri or Tue & Thu")
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['training_day', 'start_time']

    def __str__(self):
        return f"{self.course.title} - {self.batch_name} ({self.training_day} {self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')})"


class FeeInformation(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='fees')
    age_category = models.CharField(max_length=100)
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2)
    fee_period = models.CharField(
        max_length=50, 
        choices=[
            ('Monthly', 'Monthly'),
            ('Quarterly', 'Quarterly'),
            ('Annual', 'Annual'),
            ('Registration', 'Registration Fee')
        ],
        default='Monthly'
    )
    additional_notes = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Fee Information"

    def __str__(self):
        return f"{self.course.title} - {self.age_category} (${self.fee_amount}/{self.fee_period})"


class GalleryItem(models.Model):
    CATEGORY_CHOICES = [
        ('Training Photos', 'Training Photos'),
        ('Training Videos', 'Training Videos'),
        ('Competition Photos', 'Competition Photos'),
        ('Certificates', 'Certificates'),
        ('Awards', 'Awards'),
        ('Academy Events', 'Academy Events'),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=60, choices=CATEGORY_CHOICES, default='Training Photos')
    image = models.ImageField(upload_to='gallery/', blank=True, null=True)
    image_url = models.URLField(blank=True, default='')
    video_url = models.URLField(blank=True, default='', help_text="YouTube or Vimeo video link")
    description = models.TextField(blank=True)
    published_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-published_date', '-id']

    def __str__(self):
        return f"[{self.category}] {self.title}"


class Achievement(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    achievement_date = models.DateField()
    image = models.ImageField(upload_to='achievements/', blank=True, null=True)
    image_url = models.URLField(blank=True, default='')
    certificate = models.ImageField(upload_to='certificates/', blank=True, null=True)
    certificate_url = models.URLField(blank=True, default='')
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-achievement_date']

    def __str__(self):
        return self.title


class AdmissionEnquiry(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('In Review', 'In Review'),
        ('Contacted', 'Contacted'),
        ('Enrolled', 'Enrolled'),
        ('Rejected', 'Rejected')
    ]

    student_name = models.CharField(max_length=150)
    student_age = models.PositiveIntegerField()
    guardian_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name='enquiries')
    preferred_batch = models.CharField(max_length=120, blank=True)
    message = models.TextField(blank=True)
    enquiry_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='New')
    notes = models.TextField(blank=True, help_text="Staff notes & follow-up comments")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Admission Enquiries"

    def __str__(self):
        return f"{self.student_name} ({self.course.title if self.course else 'General Enquiry'}) - [{self.enquiry_status}]"
