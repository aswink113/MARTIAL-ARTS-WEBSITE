from django import forms
from core.models import SiteSettings, Banner
from courses.models import Course, Instructor, AgeCategory
from timetable.models import ClassSession
from admissions.models import AdmissionApplication, ApplicationNote
from gallery.models import GalleryItem
from achievements.models import Achievement


class StaffLoginForm(forms.Form):
    username = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Enter admin username',
            'autofocus': True,
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Enter admin password',
        })
    )


class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = [
            'name', 'discipline', 'summary', 'description', 'skills_covered',
            'prerequisites', 'image', 'age_category', 'age_group', 'level',
            'class_frequency', 'duration', 'fee', 'currency', 'fee_period',
            'joining_fee_note', 'instructor', 'is_featured', 'is_active', 'sort_order',
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'discipline': forms.Select(attrs={'class': 'form-select'}),
            'summary': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'skills_covered': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'prerequisites': forms.TextInput(attrs={'class': 'form-control'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'age_category': forms.Select(attrs={'class': 'form-select'}),
            'age_group': forms.TextInput(attrs={'class': 'form-control'}),
            'level': forms.Select(attrs={'class': 'form-select'}),
            'class_frequency': forms.TextInput(attrs={'class': 'form-control'}),
            'duration': forms.TextInput(attrs={'class': 'form-control'}),
            'fee': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'currency': forms.TextInput(attrs={'class': 'form-control'}),
            'fee_period': forms.TextInput(attrs={'class': 'form-control'}),
            'joining_fee_note': forms.TextInput(attrs={'class': 'form-control'}),
            'instructor': forms.Select(attrs={'class': 'form-select'}),
            'is_featured': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'sort_order': forms.NumberInput(attrs={'class': 'form-control'}),
        }


class InstructorForm(forms.ModelForm):
    class Meta:
        model = Instructor
        fields = [
            'name', 'role', 'is_head_coach', 'photo', 'disciplines',
            'rank_grade', 'qualifications', 'experience', 'biography',
            'sort_order', 'is_active',
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'role': forms.TextInput(attrs={'class': 'form-control'}),
            'is_head_coach': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'photo': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'disciplines': forms.TextInput(attrs={'class': 'form-control'}),
            'rank_grade': forms.TextInput(attrs={'class': 'form-control'}),
            'qualifications': forms.TextInput(attrs={'class': 'form-control'}),
            'experience': forms.TextInput(attrs={'class': 'form-control'}),
            'biography': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'sort_order': forms.NumberInput(attrs={'class': 'form-control'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class ClassSessionForm(forms.ModelForm):
    class Meta:
        model = ClassSession
        fields = [
            'course', 'instructor', 'weekday', 'start_time', 'end_time',
            'age_category', 'age_group', 'location', 'capacity', 'is_active',
        ]
        widgets = {
            'course': forms.Select(attrs={'class': 'form-select'}),
            'instructor': forms.Select(attrs={'class': 'form-select'}),
            'weekday': forms.Select(attrs={'class': 'form-select'}),
            'start_time': forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}),
            'end_time': forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}),
            'age_category': forms.Select(attrs={'class': 'form-select'}),
            'age_group': forms.TextInput(attrs={'class': 'form-control'}),
            'location': forms.TextInput(attrs={'class': 'form-control'}),
            'capacity': forms.NumberInput(attrs={'class': 'form-control'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class AgeCategoryForm(forms.ModelForm):
    class Meta:
        model = AgeCategory
        fields = ['name', 'min_age', 'max_age', 'description', 'sort_order', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'min_age': forms.NumberInput(attrs={'class': 'form-control'}),
            'max_age': forms.NumberInput(attrs={'class': 'form-control'}),
            'description': forms.TextInput(attrs={'class': 'form-control'}),
            'sort_order': forms.NumberInput(attrs={'class': 'form-control'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class GalleryItemForm(forms.ModelForm):
    class Meta:
        model = GalleryItem
        fields = [
            'category', 'media_type', 'title', 'image', 'video_url',
            'caption', 'event_date', 'minor_consent_verified', 'is_published',
        ]
        widgets = {
            'category': forms.Select(attrs={'class': 'form-select'}),
            'media_type': forms.Select(attrs={'class': 'form-select'}),
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'video_url': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://www.youtube.com/watch?v=...'}),
            'caption': forms.TextInput(attrs={'class': 'form-control'}),
            'event_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'minor_consent_verified': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'is_published': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class AchievementForm(forms.ModelForm):
    class Meta:
        model = Achievement
        fields = [
            'title', 'event_name', 'award', 'person_or_team',
            'consent_confirmed', 'date', 'description', 'certificate_image', 'is_published',
        ]
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'event_name': forms.TextInput(attrs={'class': 'form-control'}),
            'award': forms.TextInput(attrs={'class': 'form-control'}),
            'person_or_team': forms.TextInput(attrs={'class': 'form-control'}),
            'consent_confirmed': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'certificate_image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'is_published': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class AcademyInfoForm(forms.ModelForm):
    class Meta:
        model = SiteSettings
        fields = [
            'academy_name', 'tagline', 'phone', 'whatsapp', 'email', 'address',
            'opening_hours', 'map_url', 'map_embed_url', 'instagram_url', 'facebook_url',
            'youtube_url', 'founded_year', 'academy_story', 'training_philosophy',
            'footer_text', 'privacy_notice',
        ]
        widgets = {
            'academy_name': forms.TextInput(attrs={'class': 'form-control'}),
            'tagline': forms.TextInput(attrs={'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'whatsapp': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'opening_hours': forms.TextInput(attrs={'class': 'form-control'}),
            'map_url': forms.URLInput(attrs={'class': 'form-control'}),
            'map_embed_url': forms.URLInput(attrs={'class': 'form-control'}),
            'instagram_url': forms.URLInput(attrs={'class': 'form-control'}),
            'facebook_url': forms.URLInput(attrs={'class': 'form-control'}),
            'youtube_url': forms.URLInput(attrs={'class': 'form-control'}),
            'founded_year': forms.NumberInput(attrs={'class': 'form-control'}),
            'academy_story': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'training_philosophy': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'footer_text': forms.TextInput(attrs={'class': 'form-control'}),
            'privacy_notice': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
        }


class WebsiteAppearanceForm(forms.ModelForm):
    class Meta:
        model = SiteSettings
        fields = ['logo', 'primary_color', 'action_color', 'accent_color', 'show_fees_publicly']
        widgets = {
            'logo': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'primary_color': forms.TextInput(attrs={'class': 'form-control', 'type': 'color'}),
            'action_color': forms.TextInput(attrs={'class': 'form-control', 'type': 'color'}),
            'accent_color': forms.TextInput(attrs={'class': 'form-control', 'type': 'color'}),
            'show_fees_publicly': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class BannerForm(forms.ModelForm):
    class Meta:
        model = Banner
        fields = [
            'title', 'subtitle', 'proof_point', 'image', 'button_text', 'button_url',
            'secondary_button_text', 'secondary_button_url', 'sort_order', 'is_active',
        ]
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'subtitle': forms.TextInput(attrs={'class': 'form-control'}),
            'proof_point': forms.TextInput(attrs={'class': 'form-control'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'button_text': forms.TextInput(attrs={'class': 'form-control'}),
            'button_url': forms.TextInput(attrs={'class': 'form-control'}),
            'secondary_button_text': forms.TextInput(attrs={'class': 'form-control'}),
            'secondary_button_url': forms.TextInput(attrs={'class': 'form-control'}),
            'sort_order': forms.NumberInput(attrs={'class': 'form-control'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class ApplicationStatusForm(forms.ModelForm):
    class Meta:
        model = AdmissionApplication
        fields = ['status']
        widgets = {
            'status': forms.Select(attrs={'class': 'form-select'}),
        }


class ApplicationNoteForm(forms.ModelForm):
    class Meta:
        model = ApplicationNote
        fields = ['note', 'follow_up_at']
        widgets = {
            'note': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Record call outcome, trial details or internal follow-up notes...'}),
            'follow_up_at': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
        }
