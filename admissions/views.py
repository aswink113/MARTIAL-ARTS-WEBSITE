from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone

from .forms import AdmissionApplicationForm
from .models import AdmissionApplication
from courses.models import Course
from timetable.models import ClassSession


def admission_create_view(request):
    """Online admission form with course preselection and spam protection."""
    preselect_slug = request.GET.get('course', '').strip()
    initial = {}
    if preselect_slug:
        course_obj = Course.objects.filter(slug=preselect_slug, is_active=True).first()
        if course_obj:
            initial['course'] = course_obj

    if request.method == 'POST':
        last_submit = request.session.get('last_admission_ts', 0)
        now_ts = timezone.now().timestamp()
        if now_ts - last_submit < 15:
            messages.error(request, 'Please wait 15 seconds before submitting another application.')
            form = AdmissionApplicationForm(request.POST)
        else:
            form = AdmissionApplicationForm(request.POST)
            if form.is_valid():
                application = form.save()
                request.session['last_admission_ts'] = now_ts
                return redirect('admission_success', reference=application.reference)
    else:
        form = AdmissionApplicationForm(initial=initial)

    sessions = ClassSession.objects.filter(is_active=True, course__is_active=True).select_related('course')

    return render(request, 'public/admission.html', {
        'form': form,
        'sessions': sessions,
        'active_page': 'admission',
    })


def admission_success_view(request, reference):
    """
    Confirmation page displaying unguessable reference code only.
    Reveals NO private student or guardian details (Blueprint Section 10, 15, 16).
    """
    application = get_object_or_404(AdmissionApplication, reference=reference)
    return render(request, 'public/admission_success.html', {
        'reference': application.reference,
        'active_page': 'admission',
    })
