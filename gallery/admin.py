from django.contrib import admin
from .models import GalleryCategory, GalleryItem


@admin.register(GalleryCategory)
class GalleryCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'sort_order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'media_type', 'event_date', 'minor_consent_verified', 'is_published')
    list_filter = ('category', 'media_type', 'is_published', 'minor_consent_verified')
    search_fields = ('title', 'caption')
