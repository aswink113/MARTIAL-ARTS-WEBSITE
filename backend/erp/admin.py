from django.contrib import admin
from django.utils.html import format_html
from .models import UserProfile, StudentMember, StaffMember, Department, Attendance, StaffAttendance

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'code', 'description')
    list_editable = ('is_active',)


@admin.register(StaffMember)
class StaffMemberAdmin(admin.ModelAdmin):
    list_display = ('staff_id', 'full_name', 'department', 'designation', 'role_type', 'phone', 'email', 'is_active')
    list_filter = ('department', 'role_type', 'is_active')
    search_fields = ('staff_id', 'full_name', 'email', 'phone', 'designation')
    list_editable = ('is_active',)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'custom_id', 'department', 'belt_rank', 'phone')
    list_filter = ('role', 'belt_rank', 'department')
    search_fields = ('user__username', 'user__email', 'custom_id', 'phone')
    list_editable = ('role', 'belt_rank')


@admin.register(StudentMember)
class StudentMemberAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'full_name', 'department', 'course', 'batch', 'current_belt', 'fee_status_badge', 'is_active')
    list_filter = ('department', 'course', 'fee_status', 'current_belt', 'is_active')
    search_fields = ('student_id', 'full_name', 'phone', 'email')
    list_editable = ('current_belt', 'is_active')

    def fee_status_badge(self, obj):
        colors = {
            'Paid': '#10B981',
            'Due': '#F59E0B',
            'Pending': '#3B82F6',
            'Overdue': '#EF4444',
        }
        color = colors.get(obj.fee_status, '#6B7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: bold;">{}</span>',
            color,
            obj.fee_status
        )
    fee_status_badge.short_description = "Fee Status"


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'date', 'schedule', 'status_badge', 'remarks')
    list_filter = ('status', 'date')
    search_fields = ('student__full_name', 'remarks')

    def status_badge(self, obj):
        colors = {
            'Present': '#10B981',
            'Absent': '#EF4444',
            'Excused': '#3B82F6',
            'Late': '#F59E0B'
        }
        color = colors.get(obj.status, '#6B7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 7px; border-radius: 8px; font-size: 11px;">{}</span>',
            color,
            obj.status
        )
    status_badge.short_description = "Status"


@admin.register(StaffAttendance)
class StaffAttendanceAdmin(admin.ModelAdmin):
    list_display = ('staff', 'date', 'status', 'remarks', 'marked_by')
    list_filter = ('status', 'date')
    search_fields = ('staff__full_name', 'staff__staff_id', 'remarks')
