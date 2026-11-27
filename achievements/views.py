from django.shortcuts import render
from .models import Achievement


def achievement_list_view(request):
    """Public achievements, competition awards, and certificates page."""
    achievements = Achievement.objects.filter(is_published=True)
    return render(request, 'public/achievements.html', {
        'achievements': achievements,
        'active_page': 'achievements',
    })
