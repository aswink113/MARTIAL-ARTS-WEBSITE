from django.contrib import admin
from .models import ClassSession


@admin.register(ClassSession)
class ClassSessionAdmin(admin.ModelAdmin):
    list_display = ('course', 'weekday', 'start_time', 'end_time', 'instructor', 'location', 'is_active')
    list_filter = ('weekday', 'is_active', 'course')
    search_fields = ('course__name', 'location', 'instructor__name')
