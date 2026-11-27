from django.db import models
from django.utils.text import slugify
from core.validators import validate_safe_image


class AgeCategory(models.Model):
    """Approved academy age bands (e.g. Kids 5-9, Teens 10-15, Adults 16+)."""

    name = models.CharField(max_length=80)
    min_age = models.PositiveIntegerField()
    max_age = models.PositiveIntegerField()
    description = models.CharField(max_length=220, blank=True)
    sort_order = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['sort_order', 'min_age']
        verbose_name = 'Age Category'
        verbose_name_plural = 'Age Categories'

    def __str__(self):
        return f'{self.name} (Ages {self.min_age}–{self.max_age})'


class Instructor(models.Model):
    """Academy coaches and instructors with verified rank and qualifications."""

    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True, blank=True)
    role = models.CharField(max_length=100, default='Senior Instructor')
    is_head_coach = models.BooleanField(default=False)
    photo = models.ImageField(
        upload_to='instructors/',
        blank=True,
        null=True,
        validators=[validate_safe_image],
    )
    disciplines = models.CharField(
        max_length=150,
        help_text='e.g. Shotokan Karate, Self-Defence',
    )
    rank_grade = models.CharField(
        max_length=100,
        default='Black Belt',
        help_text='Verified belt rank or coaching grade.',
    )
    qualifications = models.CharField(max_length=220)
    experience = models.CharField(max_length=100, help_text='e.g. 12+ Years Coaching')
    biography = models.TextField()
    sort_order = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_head_coach', 'sort_order', 'name']
        verbose_name = 'Instructor'
        verbose_name_plural = 'Instructors'

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            counter = 1
            while Instructor.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base}-{counter}'
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} ({self.role})'


class Course(models.Model):
    """Training programmes offered by Greentrack Martial Arts."""

    DISCIPLINE_CHOICES = [
        ('Karate', 'Karate'),
        ('Boxing', 'Boxing'),
        ('Kung Fu', 'Kung Fu'),
        ('Kids Martial Arts', 'Kids Martial Arts'),
        ('Adult Training', 'Adult Training'),
        ('Self Defence', 'Self Defence'),
    ]

    LEVEL_CHOICES = [
        ('All Levels', 'All Levels'),
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    name = models.CharField(max_length=140)
    slug = models.SlugField(unique=True, blank=True)
    discipline = models.CharField(max_length=60, choices=DISCIPLINE_CHOICES)
    summary = models.CharField(max_length=200)
    description = models.TextField()
    skills_covered = models.TextField(
        help_text='Enter one skill/topic per line.',
    )
    prerequisites = models.CharField(
        max_length=200,
        default='No prior martial arts experience required. Comfortable sportswear for trial.',
    )
    image = models.ImageField(
        upload_to='courses/',
        blank=True,
        null=True,
        validators=[validate_safe_image],
    )
    age_category = models.ForeignKey(
        AgeCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='courses',
    )
    age_group = models.CharField(max_length=80, default='Ages 6–12 / All Ages')
    level = models.CharField(max_length=30, choices=LEVEL_CHOICES, default='All Levels')
    class_frequency = models.CharField(max_length=100, default='2–3 Sessions / Week')
    duration = models.CharField(max_length=80, default='60 Minutes per Session')
    fee = models.DecimalField(max_digits=8, decimal_places=2, default=1800.00)
    currency = models.CharField(max_length=10, default='₹')
    fee_period = models.CharField(max_length=40, default='per month')
    joining_fee_note = models.CharField(
        max_length=160,
        blank=True,
        default='Includes first trial assessment. Uniform kit available separately.',
    )
    instructor = models.ForeignKey(
        Instructor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='courses',
    )
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        indexes = [models.Index(fields=['is_active', 'discipline'])]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            counter = 1
            while Course.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base}-{counter}'
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def skills_list(self):
        return [s.strip() for s in self.skills_covered.splitlines() if s.strip()]

    def __str__(self):
        return self.name
