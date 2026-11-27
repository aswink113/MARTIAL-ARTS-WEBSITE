from django.db import models
from django.core.exceptions import ValidationError


class ClassSession(models.Model):
    """Scheduled weekly martial arts class session."""

    WEEKDAY_CHOICES = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    course = models.ForeignKey(
        'courses.Course',
        on_delete=models.CASCADE,
        related_name='sessions',
    )
    instructor = models.ForeignKey(
        'courses.Instructor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sessions',
    )
    weekday = models.IntegerField(choices=WEEKDAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    age_category = models.ForeignKey(
        'courses.AgeCategory',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sessions',
    )
    age_group = models.CharField(max_length=80, blank=True)
    location = models.CharField(max_length=100, default='Main Dojo Mat')
    capacity = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='Optional maximum spots per class.',
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['weekday', 'start_time']
        verbose_name = 'Class Session'
        verbose_name_plural = 'Class Sessions'
        indexes = [models.Index(fields=['weekday', 'is_active'])]

    def clean(self):
        if self.end_time and self.start_time and self.end_time <= self.start_time:
            raise ValidationError('End time must be after start time.')
        # Prevent conflicting/overlapping sessions in the same room at the same weekday
        if self.weekday is not None and self.start_time and self.end_time and self.is_active:
            conflicts = ClassSession.objects.filter(
                weekday=self.weekday,
                location__iexact=self.location,
                is_active=True,
                start_time__lt=self.end_time,
                end_time__gt=self.start_time,
            ).exclude(pk=self.pk)
            if conflicts.exists():
                raise ValidationError(
                    f'Schedule conflict: {self.location} already has a session overlapping this time on {self.get_weekday_display()}.'
                )

    def __str__(self):
        return f'{self.get_weekday_display()} {self.start_time.strftime("%H:%M")} — {self.course.name}'
