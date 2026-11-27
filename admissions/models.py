import secrets
from django.conf import settings
from django.db import models


def generate_reference_code():
    """Generate an unguessable reference code without exposing sequential DB IDs."""
    return f'GMA-{secrets.token_hex(4).upper()}'


class AdmissionApplication(models.Model):
    """Prospective student admission application submitted online."""

    STATUS_CHOICES = [
        ('New', 'New'),
        ('Contacted', 'Contacted'),
        ('Trial Scheduled', 'Trial Scheduled'),
        ('Approved', 'Approved'),
        ('Waitlisted', 'Waitlisted'),
        ('Rejected', 'Rejected'),
    ]

    EXPERIENCE_CHOICES = [
        ('None / Complete Beginner', 'None / Complete Beginner'),
        ('Less than 1 Year', 'Less than 1 Year'),
        ('1–3 Years', '1–3 Years'),
        ('3+ Years / Graded Belt', '3+ Years / Graded Belt'),
    ]

    reference = models.CharField(
        max_length=20,
        unique=True,
        default=generate_reference_code,
        editable=False,
    )
    student_name = models.CharField(max_length=140)
    date_of_birth = models.DateField()
    guardian_name = models.CharField(
        max_length=140,
        blank=True,
        help_text='Required for applicants under 18.',
    )
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    course = models.ForeignKey(
        'courses.Course',
        on_delete=models.PROTECT,
        related_name='applications',
    )
    preferred_time = models.CharField(
        max_length=140,
        blank=True,
        help_text='Preferred training days or class batch.',
    )
    experience = models.CharField(
        max_length=60,
        choices=EXPERIENCE_CHOICES,
        default='None / Complete Beginner',
    )
    message = models.TextField(blank=True)
    consent_given = models.BooleanField(default=False)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='New')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Admission Application'
        verbose_name_plural = 'Admission Applications'
        indexes = [
            models.Index(fields=['status', '-submitted_at']),
            models.Index(fields=['reference']),
        ]

    def save(self, *args, **kwargs):
        if not self.reference:
            code = generate_reference_code()
            while AdmissionApplication.objects.filter(reference=code).exists():
                code = generate_reference_code()
            self.reference = code
        super().save(*args, **kwargs)

    @property
    def computed_age(self):
        from datetime import date
        if not self.date_of_birth:
            return None
        today = date.today()
        return (
            today.year
            - self.date_of_birth.year
            - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        )

    def __str__(self):
        return f'{self.reference} — {self.student_name}'


class ApplicationNote(models.Model):
    """Internal staff follow-up notes (never exposed on public pages)."""

    application = models.ForeignKey(
        AdmissionApplication,
        on_delete=models.CASCADE,
        related_name='notes',
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    note = models.TextField()
    follow_up_at = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Application Follow-Up Note'
        verbose_name_plural = 'Application Follow-Up Notes'

    def __str__(self):
        return f'Note on {self.application.reference} ({self.created_at.strftime("%Y-%m-%d")})'
