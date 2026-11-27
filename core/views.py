from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import render, redirect
from pathlib import Path
from django.utils import timezone
from urllib.parse import quote

from .models import Banner, SiteSettings
from .forms import GeneralEnquiryForm
from courses.models import Course, Instructor
from achievements.models import Achievement
from gallery.models import GalleryItem
from timetable.models import ClassSession


def react_app(request, **kwargs):
    """Serve the Vite-built React app for public site routes on the Django domain."""
    candidates = [
        Path(__file__).resolve().parent.parent / 'static' / 'react' / 'index.html',
        Path(__file__).resolve().parent.parent / 'staticfiles' / 'react' / 'index.html',
    ]
    for index_file in candidates:
        if index_file.is_file():
            return HttpResponse(index_file.read_text(encoding='utf-8'), content_type='text/html; charset=utf-8')
    return HttpResponse(
        'The React site has not been built yet. Run npm run build in the frontend directory.',
        status=503,
        content_type='text/plain; charset=utf-8',
    )


def home_view(request):
    """Public Home page following the 10-section blueprint structure."""
    banners = Banner.objects.filter(is_active=True)
    primary_banner = banners.first()

    # Featured core disciplines (Karate, Boxing, Kung Fu first, up to 3 featured cards)
    featured_courses = list(
        Course.objects.filter(is_active=True, is_featured=True).select_related('instructor')[:3]
    )
    if len(featured_courses) < 3:
        featured_courses = list(
            Course.objects.filter(is_active=True).select_related('instructor')[:3]
        )

    kids_course = Course.objects.filter(is_active=True, discipline='Kids Martial Arts').first()
    adult_course = (
        Course.objects.filter(is_active=True, discipline='Adult Training').first()
        or Course.objects.filter(is_active=True, discipline='Self Defence').first()
    )

    head_coach = Instructor.objects.filter(is_active=True, is_head_coach=True).first()
    if not head_coach:
        head_coach = Instructor.objects.filter(is_active=True).first()

    achievements = Achievement.objects.filter(is_published=True)[:3]
    gallery_preview = GalleryItem.objects.filter(
        is_published=True, minor_consent_verified=True
    ).select_related('category')[:6]
    timetable_preview = ClassSession.objects.filter(
        is_active=True, course__is_active=True
    ).select_related('course', 'instructor')[:6]

    settings_obj = SiteSettings.objects.first()
    wa_text = quote('Hello Greentrack Martial Arts, I would like to book a trial class or enquire about admission.')

    return render(request, 'public/home.html', {
        'banners': banners,
        'primary_banner': primary_banner,
        'featured_courses': featured_courses,
        'kids_course': kids_course,
        'adult_course': adult_course,
        'head_coach': head_coach,
        'achievements': achievements,
        'gallery_preview': gallery_preview,
        'timetable_preview': timetable_preview,
        'whatsapp_prefill': wa_text,
        'active_page': 'home',
    })


def about_view(request):
    """About Us page: story, head coach, instructor roster, achievements & philosophy."""
    head_coach = Instructor.objects.filter(is_active=True, is_head_coach=True).first()
    instructors = Instructor.objects.filter(is_active=True)
    achievements = Achievement.objects.filter(is_published=True)

    return render(request, 'public/about.html', {
        'head_coach': head_coach,
        'instructors': instructors,
        'achievements': achievements,
        'active_page': 'about',
    })


def contact_view(request):
    """Contact page with click-to-call, WhatsApp, map, social links & enquiry form."""
    if request.method == 'POST':
        last_submit = request.session.get('last_enquiry_ts', 0)
        now_ts = timezone.now().timestamp()
        if now_ts - last_submit < 15:
            messages.error(request, 'Please wait a few seconds before sending another enquiry.')
            form = GeneralEnquiryForm(request.POST)
        else:
            form = GeneralEnquiryForm(request.POST)
            if form.is_valid():
                form.save()
                request.session['last_enquiry_ts'] = now_ts
                messages.success(
                    request,
                    'Thank you! Your message has been received by our team. We will reply shortly.',
                )
                return redirect('contact')
    else:
        form = GeneralEnquiryForm()

    wa_text = quote('Hello Greentrack Martial Arts, I have a question about your classes and timings.')
    return render(request, 'public/contact.html', {
        'form': form,
        'whatsapp_prefill': wa_text,
        'active_page': 'contact',
    })


def privacy_view(request):
    """Academy privacy policy and minor consent summary page."""
    return render(request, 'public/privacy.html', {
        'active_page': 'privacy',
    })
