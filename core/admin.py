from django.contrib import admin
from .models import SiteSettings, Banner, GeneralEnquiry


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('academy_name', 'phone', 'email', 'show_fees_publicly', 'updated_at')


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'sort_order', 'is_active', 'updated_at')
    list_filter = ('is_active',)
    ordering = ('sort_order',)


@admin.register(GeneralEnquiry)
class GeneralEnquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'phone', 'status', 'submitted_at')
    list_filter = ('status',)
    search_fields = ('name', 'subject', 'phone', 'email')
