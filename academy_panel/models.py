from django.conf import settings
from django.db import models


class StaffRoleProfile(models.Model):
    """Role assignment for Greentrack Martial Arts staff portal users."""

    ROLE_MANAGER = 'manager'
    ROLE_ADMISSIONS = 'admissions'
    ROLE_CONTENT = 'content'
    ROLE_GALLERY = 'gallery'
    ROLE_TIMETABLE = 'timetable'

    ROLE_CHOICES = [
        (ROLE_MANAGER, 'Owner / Manager'),
        (ROLE_ADMISSIONS, 'Admission Staff'),
        (ROLE_CONTENT, 'Content Editor'),
        (ROLE_GALLERY, 'Gallery Editor'),
        (ROLE_TIMETABLE, 'Timetable Editor'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='staff_profile',
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_ADMISSIONS)
    job_title = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Staff Role'
        verbose_name_plural = 'Staff Roles'

    def can_manage_admissions(self):
        return self.user.is_superuser or self.role in (self.ROLE_MANAGER, self.ROLE_ADMISSIONS)

    def can_manage_courses_and_info(self):
        return self.user.is_superuser or self.role in (self.ROLE_MANAGER, self.ROLE_CONTENT)

    def can_manage_timetable(self):
        return self.user.is_superuser or self.role in (self.ROLE_MANAGER, self.ROLE_TIMETABLE)

    def can_manage_gallery(self):
        return self.user.is_superuser or self.role in (self.ROLE_MANAGER, self.ROLE_GALLERY)

    def can_manage_appearance_and_staff(self):
        return self.user.is_superuser or self.role == self.ROLE_MANAGER

    def __str__(self):
        return f'{self.user.username} — {self.get_role_display()}'
