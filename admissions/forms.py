import re
from datetime import date
from django import forms
from .models import AdmissionApplication
from courses.models import Course


class AdmissionApplicationForm(forms.ModelForm):
    """Online admission form with validation, minor guardian rule, and spam check."""

    website = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'tabindex': '-1', 'autocomplete': 'off', 'class': 'd-none'}),
        label='',
    )

    class Meta:
        model = AdmissionApplication
        fields = [
            'student_name',
            'date_of_birth',
            'guardian_name',
            'phone',
            'email',
            'course',
            'preferred_time',
            'experience',
            'message',
            'consent_given',
        ]
        widgets = {
            'student_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Full name of the prospective student',
            }),
            'date_of_birth': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date',
            }),
            'guardian_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Parent / guardian full name (required if under 18)',
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '+91 98765 43210',
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'parent.or.student@example.com (optional)',
            }),
            'course': forms.Select(attrs={'class': 'form-select'}),
            'preferred_time': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g. Weekday Evenings / Saturday Morning',
            }),
            'experience': forms.Select(attrs={'class': 'form-select'}),
            'message': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Goals, questions, or any medical/learning notes our coach should know',
            }),
            'consent_given': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['course'].queryset = Course.objects.filter(is_active=True)
        self.fields['course'].empty_label = '-- Select a training programme --'
        self.fields['consent_given'].required = True

    def clean_phone(self):
        phone = self.cleaned_data.get('phone', '').strip()
        digits = re.sub(r'\D', '', phone)
        if len(digits) < 7 or len(digits) > 15:
            raise forms.ValidationError('Please provide a valid phone number containing 7–15 digits.')
        return phone

    def clean_date_of_birth(self):
        dob = self.cleaned_data.get('date_of_birth')
        if not dob:
            raise forms.ValidationError('Date of birth is required.')
        today = date.today()
        if dob >= today:
            raise forms.ValidationError('Date of birth cannot be today or in the future.')
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        if age < 4:
            raise forms.ValidationError('Applicants must be at least 4 years old to enrol.')
        if age > 100:
            raise forms.ValidationError('Please enter a valid date of birth.')
        return dob

    def clean_course(self):
        course = self.cleaned_data.get('course')
        if not course or not course.is_active:
            raise forms.ValidationError('Please select an active training course.')
        return course

    def clean_consent_given(self):
        consent = self.cleaned_data.get('consent_given')
        if not consent:
            raise forms.ValidationError(
                'You must confirm consent for the academy to store and review this application.'
            )
        return consent

    def clean_website(self):
        honeypot = self.cleaned_data.get('website', '').strip()
        if honeypot:
            raise forms.ValidationError('Spam check failed.')
        return honeypot

    def clean(self):
        cleaned = super().clean()
        dob = cleaned.get('date_of_birth')
        guardian = (cleaned.get('guardian_name') or '').strip()
        if dob:
            today = date.today()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            if age < 18 and not guardian:
                self.add_error(
                    'guardian_name',
                    'Parent or guardian name is required for applicants under 18 years old.',
                )
        return cleaned
