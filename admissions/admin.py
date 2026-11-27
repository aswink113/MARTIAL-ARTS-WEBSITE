from django.contrib import admin
from .models import AdmissionApplication, ApplicationNote


class ApplicationNoteInline(admin.TabularInline):
    model = ApplicationNote
    extra = 1


@admin.register(AdmissionApplication)
class AdmissionApplicationAdmin(admin.ModelAdmin):
    list_display = ('reference', 'student_name', 'course', 'phone', 'status', 'submitted_at')
    list_filter = ('status', 'course')
    search_fields = ('reference', 'student_name', 'phone', 'guardian_name')
    readonly_fields = ('reference', 'submitted_at', 'updated_at')
    inlines = [ApplicationNoteInline]
