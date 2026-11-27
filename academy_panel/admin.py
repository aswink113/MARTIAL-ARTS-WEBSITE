from django.contrib import admin
from .models import StaffRoleProfile


@admin.register(StaffRoleProfile)
class StaffRoleProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'job_title', 'updated_at')
    list_filter = ('role',)
