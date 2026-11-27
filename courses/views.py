from django.shortcuts import render, get_object_or_404
from .models import Course, AgeCategory


def course_list_view(request):
    """Courses listing page with simple discipline, age group, and level filters."""
    discipline = request.GET.get('discipline', '').strip()
    age_cat_id = request.GET.get('age_group', '').strip()
    level = request.GET.get('level', '').strip()

    courses = Course.objects.filter(is_active=True).select_related('age_category', 'instructor')

    if discipline:
        courses = courses.filter(discipline=discipline)
    if age_cat_id and age_cat_id.isdigit():
        courses = courses.filter(age_category_id=int(age_cat_id))
    if level:
        courses = courses.filter(level=level)

    age_categories = AgeCategory.objects.filter(is_active=True)

    return render(request, 'public/courses/list.html', {
        'courses': courses,
        'disciplines': [d[0] for d in Course.DISCIPLINE_CHOICES],
        'levels': [l[0] for l in Course.LEVEL_CHOICES],
        'age_categories': age_categories,
        'selected_discipline': discipline,
        'selected_age_group': age_cat_id,
        'selected_level': level,
        'active_page': 'courses',
    })


def course_detail_view(request, slug):
    """Course detail page showing syllabus, prerequisites, instructor, timetable & fees."""
    course = get_object_or_404(
        Course.objects.select_related('age_category', 'instructor'),
        slug=slug,
        is_active=True,
    )
    sessions = course.sessions.filter(is_active=True).select_related('instructor', 'age_category')
    other_courses = Course.objects.filter(is_active=True).exclude(pk=course.pk)[:3]

    return render(request, 'public/courses/detail.html', {
        'course': course,
        'sessions': sessions,
        'other_courses': other_courses,
        'active_page': 'courses',
    })
