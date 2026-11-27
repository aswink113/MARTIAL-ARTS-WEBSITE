from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST
from admissions.forms import AdmissionApplicationForm
from core.forms import GeneralEnquiryForm

from achievements.models import Achievement
from core.models import SiteSettings, Banner
from courses.models import Course, Instructor
from gallery.models import GalleryItem, GalleryCategory
from timetable.models import ClassSession


def _image_url(field):
    try:
        return field.url if field else ""
    except (ValueError, AttributeError):
        return ""


@ensure_csrf_cookie
@require_GET
def public_data(request):
    settings_obj = SiteSettings.objects.first() or SiteSettings(academy_name='Greentrack Martial Arts')
    courses = Course.objects.filter(is_active=True).select_related("instructor", "age_category")
    instructors = Instructor.objects.filter(is_active=True)
    sessions = ClassSession.objects.filter(is_active=True, course__is_active=True).select_related("course", "instructor")
    gallery = GalleryItem.objects.filter(is_published=True, minor_consent_verified=True).select_related("category")
    data = {
        "settings": {
            "academy_name": settings_obj.academy_name,
            "tagline": settings_obj.tagline,
            "phone": settings_obj.phone,
            "whatsapp": settings_obj.whatsapp,
            "email": settings_obj.email,
            "address": settings_obj.address,
            "opening_hours": settings_obj.opening_hours,
            "map_url": settings_obj.map_url,
            "instagram_url": settings_obj.instagram_url,
            "facebook_url": settings_obj.facebook_url,
            "youtube_url": settings_obj.youtube_url,
            "story": settings_obj.academy_story,
            "philosophy": settings_obj.training_philosophy,
            "footer_text": settings_obj.footer_text,
            "privacy_notice": settings_obj.privacy_notice,
            "founded_year": settings_obj.founded_year,
            "primary_color": settings_obj.primary_color,
            "action_color": settings_obj.action_color,
            "accent_color": settings_obj.accent_color,
            "show_fees_publicly": settings_obj.show_fees_publicly,
            "logo": _image_url(settings_obj.logo),
        } if settings_obj else {},
        "banners": [{"title": b.title, "subtitle": b.subtitle, "proof_point": b.proof_point,
                     "image": _image_url(b.image), "button_text": b.button_text,
                     "button_url": b.button_url, "secondary_button_text": b.secondary_button_text,
                     "secondary_button_url": b.secondary_button_url}
                    for b in Banner.objects.filter(is_active=True)],
        "courses": [{"id": c.pk, "name": c.name, "slug": c.slug, "discipline": c.discipline,
                     "summary": c.summary, "description": c.description,
                     "skills": c.skills_covered.splitlines(), "age_group": c.age_group,
                     "level": c.level, "frequency": c.class_frequency, "duration": c.duration,
                     "fee": str(c.fee) if settings_obj and settings_obj.show_fees_publicly else "",
                     "currency": c.currency, "fee_period": c.fee_period, "image": _image_url(c.image),
                     "featured": c.is_featured, "instructor": c.instructor.name if c.instructor else ""}
                    for c in courses],
        "instructors": [{"name": i.name, "role": i.role, "disciplines": i.disciplines,
                         "rank": i.rank_grade, "qualifications": i.qualifications,
                         "experience": i.experience, "biography": i.biography,
                         "photo": _image_url(i.photo), "head_coach": i.is_head_coach}
                        for i in instructors],
        "sessions": [{"weekday": s.get_weekday_display(), "start": s.start_time.strftime("%I:%M %p"),
                      "end": s.end_time.strftime("%I:%M %p"), "course": s.course.name,
                      "instructor": s.instructor.name if s.instructor else "",
                      "age_group": s.age_group, "location": s.location}
                     for s in sessions],
        "gallery": [{"title": g.title, "caption": g.caption, "image": _image_url(g.image),
                     "video_url": g.embed_url(), "media_type": g.media_type,
                     "category": g.category.name}
                    for g in gallery],
        "categories": [{"name": c.name, "slug": c.slug} for c in GalleryCategory.objects.filter(is_active=True)],
        "achievements": [{"title": a.title, "event": a.event_name, "award": a.award,
                          "person": a.person_or_team if a.consent_confirmed else "",
                          "date": a.date.isoformat(), "description": a.description,
                          "image": _image_url(a.certificate_image)}
                         for a in Achievement.objects.filter(is_published=True)],
    }
    return JsonResponse(data)


@require_POST
def submit_application(request):
    from json import JSONDecodeError, loads
    try:
        payload = loads(request.body or b"{}")
        form = AdmissionApplicationForm(payload)
        if not form.is_valid():
            errors = " ".join(f"{label}: {', '.join(messages)}" for label, messages in form.errors.items())
            return JsonResponse({"error": errors}, status=400)
        application = form.save()
        return JsonResponse({"reference": application.reference}, status=201)
    except (JSONDecodeError, TypeError):
        return JsonResponse({"error": "Please provide valid application details."}, status=400)


@require_POST
def submit_enquiry(request):
    from json import JSONDecodeError, loads
    try:
        payload = loads(request.body or b"{}")
        form = GeneralEnquiryForm(payload)
        if not form.is_valid():
            errors = " ".join(f"{label}: {', '.join(messages)}" for label, messages in form.errors.items())
            return JsonResponse({"error": errors}, status=400)
        form.save()
        return JsonResponse({"ok": True}, status=201)
    except (JSONDecodeError, TypeError, AttributeError):
        return JsonResponse({"error": "Please provide valid enquiry details."}, status=400)
