from django.shortcuts import render
from .models import ClassSession
from courses.models import Course, AgeCategory


def timetable_view(request):
    """Weekly timetable grouped by day, with stacked cards on mobile."""
    discipline = request.GET.get('discipline', '').strip()
    age_cat_id = request.GET.get('age_group', '').strip()

    sessions = ClassSession.objects.filter(
        is_active=True,
        course__is_active=True,
    ).select_related('course', 'instructor', 'age_category')

    if discipline:
        sessions = sessions.filter(course__discipline=discipline)
    if age_cat_id and age_cat_id.isdigit():
        sessions = sessions.filter(age_category_id=int(age_cat_id))

    days_grouped = []
    for day_idx, day_name in ClassSession.WEEKDAY_CHOICES:
        day_sessions = [s for s in sessions if s.weekday == day_idx]
        if day_sessions:
            days_grouped.append({
                'day_index': day_idx,
                'day_name': day_name,
                'sessions': day_sessions,
            })

    courses_for_fees = Course.objects.filter(is_active=True).select_related('age_category')

    return render(request, 'public/timetable.html', {
        'days_grouped': days_grouped,
        'all_sessions': sessions,
        'courses_for_fees': courses_for_fees,
        'disciplines': [d[0] for d in Course.DISCIPLINE_CHOICES],
        'age_categories': AgeCategory.objects.filter(is_active=True),
        'selected_discipline': discipline,
        'selected_age_group': age_cat_id,
        'active_page': 'timetable',
    })
