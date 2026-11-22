from django.contrib import admin
from django.utils.html import format_html
from .models import (
    AcademySettings,
    Course,
    Instructor,
    ClassSchedule,
    FeeInformation,
    GalleryItem,
    Achievement,
    AdmissionEnquiry
)

admin.site.site_header = "Warrior Martial Arts Academy Admin"
admin.site.site_title = "Martial Arts Portal"
admin.site.index_title = "Dojo Operations & Content Management"


@admin.register(AcademySettings)
class AcademySettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Academy Profile", {
            "fields": ("academy_name", "academy_description", "academy_logo", "logo_url", "hero_banner", "hero_banner_url")
        }),
        ("Contact & Location", {
            "fields": ("contact_number", "whatsapp_number", "email", "academy_address", "google_maps_url", "operating_hours")
        }),
        ("Social Media", {
            "fields": ("instagram_url", "facebook_url")
        }),
        ("Dojo Stats (Home Page Counters)", {
            "fields": ("years_experience", "happy_students", "expert_instructors", "discipline_focus")
        }),
    )

    def has_add_permission(self, request):
        # Enforce singleton
        return not AcademySettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


class ClassScheduleInline(admin.TabularInline):
    model = ClassSchedule
    extra = 1


class FeeInformationInline(admin.TabularInline):
    model = FeeInformation
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'age_group', 'duration', 'monthly_fee', 'display_order', 'is_active', 'image_preview')
    list_filter = ('is_active', 'age_group')
    search_fields = ('title', 'short_description', 'description')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('display_order', 'is_active', 'monthly_fee')
    inlines = [ClassScheduleInline, FeeInformationInline]

    def image_preview(self, obj):
        url = obj.image.url if obj.image else obj.image_url
        if url:
            return format_html('<img src="{}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;" />', url)
        return "No image"
    image_preview.short_description = "Thumbnail"


@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ('name', 'designation', 'experience', 'is_head_coach', 'is_active', 'display_order', 'photo_preview')
    list_filter = ('is_head_coach', 'is_active')
    search_fields = ('name', 'designation', 'biography', 'qualifications')
    list_editable = ('is_head_coach', 'is_active', 'display_order')

    def photo_preview(self, obj):
        url = obj.profile_image.url if obj.profile_image else obj.image_url
        if url:
            return format_html('<img src="{}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />', url)
        return "No photo"
    photo_preview.short_description = "Photo"


@admin.register(ClassSchedule)
class ClassScheduleAdmin(admin.ModelAdmin):
    list_display = ('course', 'batch_name', 'age_category', 'training_day', 'start_time', 'end_time', 'is_active')
    list_filter = ('course', 'training_day', 'is_active')
    search_fields = ('batch_name', 'course__title', 'age_category')
    list_editable = ('is_active',)


@admin.register(FeeInformation)
class FeeInformationAdmin(admin.ModelAdmin):
    list_display = ('course', 'age_category', 'fee_amount', 'fee_period')
    list_filter = ('course', 'fee_period')
    search_fields = ('course__title', 'age_category')


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'published_date', 'is_active', 'media_preview')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'description')
    list_editable = ('is_active',)

    def media_preview(self, obj):
        url = obj.image.url if obj.image else obj.image_url
        if url:
            return format_html('<img src="{}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;" />', url)
        if obj.video_url:
            return format_html('<a href="{}" target="_blank" style="color: #e50914;">▶ Video</a>', obj.video_url)
        return "No Media"
    media_preview.short_description = "Preview"


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'achievement_date', 'is_active', 'badge_preview')
    list_filter = ('is_active', 'achievement_date')
    search_fields = ('title', 'description')
    list_editable = ('is_active',)

    def badge_preview(self, obj):
        url = obj.image.url if obj.image else obj.image_url
        if url:
            return format_html('<img src="{}" style="width: 45px; height: 45px; object-fit: contain;" />', url)
        return "No Image"
    badge_preview.short_description = "Trophy/Badge"


@admin.register(AdmissionEnquiry)
class AdmissionEnquiryAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'student_age', 'guardian_name', 'phone', 'email', 'course', 'preferred_batch', 'enquiry_status_badge', 'created_at')
    list_filter = ('enquiry_status', 'course', 'created_at')
    search_fields = ('student_name', 'guardian_name', 'phone', 'email', 'message')
    readonly_fields = ('created_at',)
    actions = ['mark_as_contacted', 'mark_as_enrolled', 'mark_as_in_review', 'mark_as_rejected']

    def enquiry_status_badge(self, obj):
        colors = {
            'New': '#3B82F6',        # Blue
            'In Review': '#F59E0B',  # Amber
            'Contacted': '#8B5CF6',  # Purple
            'Enrolled': '#10B981',   # Green
            'Rejected': '#EF4444',   # Red
        }
        color = colors.get(obj.enquiry_status, '#6B7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">{}</span>',
            color,
            obj.enquiry_status
        )
    enquiry_status_badge.short_description = "Status"

    @admin.action(description="Mark selected enquiries as Contacted")
    def mark_as_contacted(self, request, queryset):
        queryset.update(enquiry_status='Contacted')

    @admin.action(description="Mark selected enquiries as Enrolled")
    def mark_as_enrolled(self, request, queryset):
        queryset.update(enquiry_status='Enrolled')

    @admin.action(description="Mark selected enquiries as In Review")
    def mark_as_in_review(self, request, queryset):
        queryset.update(enquiry_status='In Review')

    @admin.action(description="Mark selected enquiries as Rejected")
    def mark_as_rejected(self, request, queryset):
        queryset.update(enquiry_status='Rejected')
