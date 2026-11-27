from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.db.models import Count, Q
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone

from .decorators import admin_panel_required
from .forms import (
    StaffLoginForm,
    CourseForm,
    InstructorForm,
    ClassSessionForm,
    AgeCategoryForm,
    GalleryItemForm,
    AchievementForm,
    AcademyInfoForm,
    WebsiteAppearanceForm,
    BannerForm,
    ApplicationStatusForm,
    ApplicationNoteForm,
)
from core.models import SiteSettings, Banner, GeneralEnquiry
from courses.models import Course, Instructor, AgeCategory
from timetable.models import ClassSession
from admissions.models import AdmissionApplication
from gallery.models import GalleryCategory, GalleryItem
from achievements.models import Achievement


def staff_login_view(request):
    """Branded Greentrack Martial Arts single-admin sign-in page."""
    if request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser):
        return redirect('academy_panel:overview')

    if request.method == 'POST':
        form = StaffLoginForm(request.POST)
        if form.is_valid():
            user = authenticate(
                request,
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password'],
            )
            if user is not None and user.is_active and (user.is_staff or user.is_superuser):
                login(request, user)
                next_url = request.GET.get('next') or 'academy_panel:overview'
                return redirect(next_url)
            messages.error(request, 'Invalid admin username or password.')
    else:
        form = StaffLoginForm()

    return render(request, 'dashboard/login.html', {'form': form})


def staff_logout_view(request):
    """Sign out of the Academy Admin Panel."""
    logout(request)
    messages.success(request, 'You have been signed out safely.')
    return redirect('academy_panel:login')


@admin_panel_required
def overview_view(request):
    """Unified Academy Admin overview with summary cards, quick actions & recent applications."""
    hour = timezone.localtime().hour
    greeting = 'Good morning' if hour < 12 else ('Good afternoon' if hour < 17 else 'Good evening')

    new_apps_count = AdmissionApplication.objects.filter(status='New').count()
    followup_apps_count = AdmissionApplication.objects.filter(
        status__in=['New', 'Contacted', 'Trial Scheduled']
    ).count()
    active_courses_count = Course.objects.filter(is_active=True).count()
    active_sessions_count = ClassSession.objects.filter(is_active=True, course__is_active=True).count()
    new_enquiries_count = GeneralEnquiry.objects.filter(status='New').count()
    gallery_count = GalleryItem.objects.filter(is_published=True).count()
    recent_applications = AdmissionApplication.objects.select_related('course')[:8]

    return render(request, 'dashboard/overview.html', {
        'greeting': greeting,
        'new_apps_count': new_apps_count,
        'followup_apps_count': followup_apps_count,
        'active_courses_count': active_courses_count,
        'active_sessions_count': active_sessions_count,
        'new_enquiries_count': new_enquiries_count,
        'gallery_count': gallery_count,
        'recent_applications': recent_applications,
        'active_nav': 'overview',
    })


@admin_panel_required
def application_list_view(request):
    """Filterable list of admission applications."""
    status_filter = request.GET.get('status', '').strip()
    search_q = request.GET.get('q', '').strip()

    apps = AdmissionApplication.objects.select_related('course').annotate(notes_count=Count('notes'))
    if status_filter:
        apps = apps.filter(status=status_filter)
    if search_q:
        apps = apps.filter(
            Q(student_name__icontains=search_q)
            | Q(guardian_name__icontains=search_q)
            | Q(reference__icontains=search_q)
            | Q(phone__icontains=search_q)
        )

    return render(request, 'dashboard/applications/list.html', {
        'applications': apps,
        'status_choices': [s[0] for s in AdmissionApplication.STATUS_CHOICES],
        'selected_status': status_filter,
        'search_q': search_q,
        'active_nav': 'applications',
    })


@admin_panel_required
def application_detail_view(request, pk):
    """Review applicant details, update status, and record internal follow-up notes."""
    application = get_object_or_404(AdmissionApplication.objects.select_related('course'), pk=pk)

    status_form = ApplicationStatusForm(instance=application)
    note_form = ApplicationNoteForm()

    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'update_status':
            status_form = ApplicationStatusForm(request.POST, instance=application)
            if status_form.is_valid():
                status_form.save()
                messages.success(request, f'Application {application.reference} status updated to {application.status}.')
                return redirect('academy_panel:application_detail', pk=application.pk)
        elif action == 'add_note':
            note_form = ApplicationNoteForm(request.POST)
            if note_form.is_valid():
                note_obj = note_form.save(commit=False)
                note_obj.application = application
                note_obj.author = request.user
                note_obj.save()
                messages.success(request, 'Internal follow-up note saved.')
                return redirect('academy_panel:application_detail', pk=application.pk)
        elif action == 'delete_application':
            ref = application.reference
            application.delete()
            messages.success(request, f'Application {ref} removed.')
            return redirect('academy_panel:applications')

    return render(request, 'dashboard/applications/detail.html', {
        'application': application,
        'status_form': status_form,
        'note_form': note_form,
        'notes': application.notes.select_related('author'),
        'active_nav': 'applications',
    })


@admin_panel_required
def general_enquiries_view(request):
    """View, update, or remove general contact form enquiries."""
    if request.method == 'POST':
        enq_id = request.POST.get('enquiry_id')
        enq = get_object_or_404(GeneralEnquiry, pk=enq_id)
        if request.POST.get('action') == 'delete_enquiry':
            enq.delete()
            messages.success(request, 'Enquiry deleted.')
            return redirect('academy_panel:enquiries')

        new_status = request.POST.get('status')
        if new_status in dict(GeneralEnquiry.STATUS_CHOICES):
            enq.status = new_status
            enq.staff_notes = request.POST.get('staff_notes', enq.staff_notes)
            enq.save()
            messages.success(request, f'Enquiry from {enq.name} updated.')
        return redirect('academy_panel:enquiries')

    enquiries = GeneralEnquiry.objects.all()
    return render(request, 'dashboard/content/enquiries.html', {
        'enquiries': enquiries,
        'status_choices': [s[0] for s in GeneralEnquiry.STATUS_CHOICES],
        'active_nav': 'enquiries',
    })


@admin_panel_required
def content_hub_view(request):
    """Unified editing hub showing all website sections in one place."""
    return render(request, 'dashboard/content/hub.html', {
        'courses_count': Course.objects.count(),
        'sessions_count': ClassSession.objects.count(),
        'instructors_count': Instructor.objects.count(),
        'gallery_count': GalleryItem.objects.count(),
        'achievements_count': Achievement.objects.count(),
        'banners_count': Banner.objects.count(),
        'active_nav': 'content',
    })


@admin_panel_required
def manage_courses_view(request):
    """Create, edit, archive/publish, or delete courses."""
    edit_id = request.GET.get('edit')
    instance = get_object_or_404(Course, pk=edit_id) if edit_id and edit_id.isdigit() else None

    if request.method == 'POST':
        if request.POST.get('toggle_id'):
            course = get_object_or_404(Course, pk=request.POST.get('toggle_id'))
            course.is_active = not course.is_active
            course.save()
            messages.success(request, f'{course.name} marked as {"Active" if course.is_active else "Archived"}.')
            return redirect('academy_panel:manage_courses')

        if request.POST.get('delete_id'):
            course = get_object_or_404(Course, pk=request.POST.get('delete_id'))
            name = course.name
            try:
                course.delete()
                messages.success(request, f'Course "{name}" deleted.')
            except Exception:
                course.is_active = False
                course.save()
                messages.warning(request, f'Course "{name}" has linked applications and was archived instead.')
            return redirect('academy_panel:manage_courses')

        post_id = request.POST.get('course_id')
        inst = get_object_or_404(Course, pk=post_id) if post_id else None
        form = CourseForm(request.POST, request.FILES, instance=inst)
        if form.is_valid():
            saved = form.save()
            messages.success(request, f'Course "{saved.name}" saved successfully.')
            return redirect('academy_panel:manage_courses')
    else:
        form = CourseForm(instance=instance)

    courses = Course.objects.select_related('instructor', 'age_category').all()
    return render(request, 'dashboard/content/courses.html', {
        'courses': courses,
        'form': form,
        'editing': instance,
        'active_nav': 'courses',
    })


@admin_panel_required
def manage_instructors_view(request):
    """Add, edit, toggle visibility, or delete instructors."""
    edit_id = request.GET.get('edit')
    instance = get_object_or_404(Instructor, pk=edit_id) if edit_id and edit_id.isdigit() else None

    if request.method == 'POST':
        if request.POST.get('toggle_id'):
            inst_obj = get_object_or_404(Instructor, pk=request.POST.get('toggle_id'))
            inst_obj.is_active = not inst_obj.is_active
            inst_obj.save()
            messages.success(request, f'{inst_obj.name} visibility updated.')
            return redirect('academy_panel:manage_instructors')

        if request.POST.get('delete_id'):
            inst_obj = get_object_or_404(Instructor, pk=request.POST.get('delete_id'))
            name = inst_obj.name
            inst_obj.delete()
            messages.success(request, f'Instructor "{name}" removed.')
            return redirect('academy_panel:manage_instructors')

        post_id = request.POST.get('instructor_id')
        target = get_object_or_404(Instructor, pk=post_id) if post_id else None
        form = InstructorForm(request.POST, request.FILES, instance=target)
        if form.is_valid():
            saved = form.save()
            messages.success(request, f'Instructor "{saved.name}" saved successfully.')
            return redirect('academy_panel:manage_instructors')
    else:
        form = InstructorForm(instance=instance)

    return render(request, 'dashboard/content/instructors.html', {
        'instructors': Instructor.objects.all(),
        'form': form,
        'editing': instance,
        'active_nav': 'instructors',
    })


@admin_panel_required
def manage_timetable_view(request):
    """Manage weekly class sessions and age categories."""
    edit_id = request.GET.get('edit')
    instance = get_object_or_404(ClassSession, pk=edit_id) if edit_id and edit_id.isdigit() else None

    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'toggle_session':
            sess = get_object_or_404(ClassSession, pk=request.POST.get('session_id'))
            sess.is_active = not sess.is_active
            sess.save()
            messages.success(request, 'Class session status updated.')
            return redirect('academy_panel:manage_timetable')
        elif action == 'delete_session':
            sess = get_object_or_404(ClassSession, pk=request.POST.get('session_id'))
            sess.delete()
            messages.success(request, 'Class session removed.')
            return redirect('academy_panel:manage_timetable')
        elif action == 'save_age_category':
            age_form = AgeCategoryForm(request.POST)
            if age_form.is_valid():
                age_form.save()
                messages.success(request, 'Age category added.')
                return redirect('academy_panel:manage_timetable')
            form = ClassSessionForm(instance=instance)
        elif action == 'delete_age_category':
            cat = get_object_or_404(AgeCategory, pk=request.POST.get('age_id'))
            cat.delete()
            messages.success(request, 'Age category removed.')
            return redirect('academy_panel:manage_timetable')
        else:
            post_id = request.POST.get('session_id')
            target = get_object_or_404(ClassSession, pk=post_id) if post_id else None
            form = ClassSessionForm(request.POST, instance=target)
            if form.is_valid():
                form.save()
                messages.success(request, 'Class session saved to timetable.')
                return redirect('academy_panel:manage_timetable')
            age_form = AgeCategoryForm()
    else:
        form = ClassSessionForm(instance=instance)
        age_form = AgeCategoryForm()

    return render(request, 'dashboard/content/timetable.html', {
        'sessions': ClassSession.objects.select_related('course', 'instructor', 'age_category').all(),
        'age_categories': AgeCategory.objects.all(),
        'form': form,
        'age_form': age_form,
        'editing': instance,
        'active_nav': 'timetable',
    })


@admin_panel_required
def manage_gallery_view(request):
    """Upload, edit, preview, publish/unpublish, and delete gallery items."""
    edit_id = request.GET.get('edit')
    instance = get_object_or_404(GalleryItem, pk=edit_id) if edit_id and edit_id.isdigit() else None

    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'toggle_publish':
            item = get_object_or_404(GalleryItem, pk=request.POST.get('item_id'))
            item.is_published = not item.is_published
            item.save()
            messages.success(
                request,
                f'"{item.title}" is now {"Published" if item.is_published else "Draft / Unpublished"}.',
            )
            return redirect('academy_panel:manage_gallery')
        elif action == 'delete_item':
            item = get_object_or_404(GalleryItem, pk=request.POST.get('item_id'))
            item.delete()
            messages.success(request, 'Gallery item removed.')
            return redirect('academy_panel:manage_gallery')
        else:
            post_id = request.POST.get('item_id')
            target = get_object_or_404(GalleryItem, pk=post_id) if post_id else None
            form = GalleryItemForm(request.POST, request.FILES, instance=target)
            if form.is_valid():
                saved = form.save()
                messages.success(request, f'Gallery item "{saved.title}" saved.')
                return redirect('academy_panel:manage_gallery')
    else:
        form = GalleryItemForm(instance=instance)

    return render(request, 'dashboard/content/gallery.html', {
        'items': GalleryItem.objects.select_related('category').all(),
        'categories': GalleryCategory.objects.all(),
        'form': form,
        'editing': instance,
        'active_nav': 'gallery',
    })


@admin_panel_required
def manage_achievements_view(request):
    """Add, edit, publish/unpublish, or delete awards & certificates."""
    edit_id = request.GET.get('edit')
    instance = get_object_or_404(Achievement, pk=edit_id) if edit_id and edit_id.isdigit() else None

    if request.method == 'POST':
        if request.POST.get('toggle_id'):
            ach = get_object_or_404(Achievement, pk=request.POST.get('toggle_id'))
            ach.is_published = not ach.is_published
            ach.save()
            messages.success(request, f'Achievement "{ach.title}" status updated.')
            return redirect('academy_panel:manage_achievements')

        if request.POST.get('delete_id'):
            ach = get_object_or_404(Achievement, pk=request.POST.get('delete_id'))
            ach.delete()
            messages.success(request, 'Achievement deleted.')
            return redirect('academy_panel:manage_achievements')

        post_id = request.POST.get('achievement_id')
        target = get_object_or_404(Achievement, pk=post_id) if post_id else None
        form = AchievementForm(request.POST, request.FILES, instance=target)
        if form.is_valid():
            saved = form.save()
            messages.success(request, f'Achievement "{saved.title}" saved.')
            return redirect('academy_panel:manage_achievements')
    else:
        form = AchievementForm(instance=instance)

    return render(request, 'dashboard/content/achievements.html', {
        'achievements': Achievement.objects.all(),
        'form': form,
        'editing': instance,
        'active_nav': 'achievements',
    })


@admin_panel_required
def manage_academy_info_view(request):
    """Edit academy story, mission, phone, WhatsApp, address, social links & privacy notice."""
    settings_obj = SiteSettings.objects.first() or SiteSettings.objects.create()
    if request.method == 'POST':
        form = AcademyInfoForm(request.POST, instance=settings_obj)
        if form.is_valid():
            form.save()
            messages.success(request, 'Academy information updated across the public website.')
            return redirect('academy_panel:manage_info')
    else:
        form = AcademyInfoForm(instance=settings_obj)

    return render(request, 'dashboard/content/academy_info.html', {
        'form': form,
        'active_nav': 'info',
    })


@admin_panel_required
def manage_appearance_view(request):
    """Manage logo, brand colours, fee visibility, and home hero banners."""
    settings_obj = SiteSettings.objects.first() or SiteSettings.objects.create()
    edit_banner_id = request.GET.get('edit_banner')
    editing_banner = get_object_or_404(Banner, pk=edit_banner_id) if edit_banner_id and edit_banner_id.isdigit() else None

    appearance_form = WebsiteAppearanceForm(instance=settings_obj)
    banner_form = BannerForm(instance=editing_banner)

    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'save_appearance':
            appearance_form = WebsiteAppearanceForm(request.POST, request.FILES, instance=settings_obj)
            if appearance_form.is_valid():
                appearance_form.save()
                messages.success(request, 'Website appearance & theme settings updated.')
                return redirect('academy_panel:manage_appearance')
        elif action == 'save_banner':
            b_id = request.POST.get('banner_id')
            target_b = get_object_or_404(Banner, pk=b_id) if b_id else None
            banner_form = BannerForm(request.POST, request.FILES, instance=target_b)
            if banner_form.is_valid():
                banner_form.save()
                messages.success(request, 'Hero banner saved.')
                return redirect('academy_panel:manage_appearance')
        elif action == 'toggle_banner':
            b = get_object_or_404(Banner, pk=request.POST.get('banner_id'))
            b.is_active = not b.is_active
            b.save()
            messages.success(request, 'Banner status updated.')
            return redirect('academy_panel:manage_appearance')
        elif action == 'delete_banner':
            b = get_object_or_404(Banner, pk=request.POST.get('banner_id'))
            b.delete()
            messages.success(request, 'Banner deleted.')
            return redirect('academy_panel:manage_appearance')

    return render(request, 'dashboard/content/appearance.html', {
        'appearance_form': appearance_form,
        'banner_form': banner_form,
        'editing_banner': editing_banner,
        'banners': Banner.objects.all(),
        'active_nav': 'appearance',
    })


@admin_panel_required
def account_settings_view(request):
    """Allow the single Academy Admin to update their password cleanly."""
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Admin password updated successfully.')
            return redirect('academy_panel:account_settings')
    else:
        form = PasswordChangeForm(request.user)

    for field in form.fields.values():
        field.widget.attrs['class'] = 'form-control'

    return render(request, 'dashboard/content/account_settings.html', {
        'form': form,
        'active_nav': 'account',
    })
