import re
from django import forms
from .models import GeneralEnquiry


class GeneralEnquiryForm(forms.ModelForm):
    """Contact page general enquiry form with honeypot spam protection."""

    website = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'tabindex': '-1', 'autocomplete': 'off', 'class': 'd-none'}),
        label='',
    )

    class Meta:
        model = GeneralEnquiry
        fields = ['name', 'phone', 'email', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your full name',
                'required': True,
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '+91 98765 43210',
                'required': True,
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'you@example.com (optional)',
            }),
            'subject': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Trial class question, schedule, etc.',
                'required': True,
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'How can our coaching team help you?',
                'required': True,
            }),
        }

    def clean_phone(self):
        phone = self.cleaned_data.get('phone', '').strip()
        digits = re.sub(r'\D', '', phone)
        if len(digits) < 7 or len(digits) > 15:
            raise forms.ValidationError('Please enter a valid contact phone number (7–15 digits).')
        return phone

    def clean_website(self):
        honeypot = self.cleaned_data.get('website', '').strip()
        if honeypot:
            raise forms.ValidationError('Spam submission detected.')
        return honeypot
