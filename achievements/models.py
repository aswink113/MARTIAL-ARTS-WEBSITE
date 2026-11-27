from django.db import models
from core.validators import validate_safe_image


class Achievement(models.Model):
    """Competition awards, grading certificates, and academy milestones."""

    title = models.CharField(max_length=160)
    event_name = models.CharField(max_length=160)
    award = models.CharField(max_length=120, help_text='e.g. Gold Medal, 3rd Dan Black Belt')
    person_or_team = models.CharField(
        max_length=140,
        blank=True,
        help_text='Display student/team name only if consent is confirmed.',
    )
    consent_confirmed = models.BooleanField(
        default=True,
        help_text='Confirm consent before publishing student names or photos.',
    )
    date = models.DateField()
    description = models.TextField()
    certificate_image = models.ImageField(
        upload_to='achievements/',
        blank=True,
        null=True,
        validators=[validate_safe_image],
    )
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = 'Achievement'
        verbose_name_plural = 'Achievements'

    def __str__(self):
        return f'{self.title} ({self.date.year})'
