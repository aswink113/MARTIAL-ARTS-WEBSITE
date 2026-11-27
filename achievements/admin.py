from django.contrib import admin
from .models import Achievement


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_name', 'award', 'date', 'consent_confirmed', 'is_published')
    list_filter = ('is_published', 'consent_confirmed')
    search_fields = ('title', 'event_name', 'award', 'person_or_team')
