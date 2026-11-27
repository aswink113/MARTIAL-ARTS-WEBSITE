from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path

from core.api import public_data, submit_application, submit_enquiry
from core.views import react_app

# Customize built-in Django admin titles to match Greentrack Martial Arts
admin.site.site_header = 'Greentrack Martial Arts — Technical Admin'
admin.site.site_title = 'Greentrack Technical Portal'
admin.site.index_title = 'Academy Administration'

urlpatterns = [
    # Branded Staff Dashboard Portal (Blueprint Section 11 & 14)
    path('academy-panel/', include('academy_panel.urls', namespace='academy_panel')),

    # Technical Django Admin (kept on /system-admin/ or /admin/ for superusers)
    path('admin/', admin.site.urls),
    path('api/public/', public_data, name='public_data'),
    path('api/applications/', submit_application, name='submit_application'),
    path('api/enquiries/', submit_enquiry, name='submit_enquiry'),
    path('', react_app, name='home'),
    # React owns all public URLs. Keep Django's academy dashboard and admin routes above it.
    re_path(r'^(?!api/|admin/|academy-panel/|static/|media/).*$', react_app, name='react_app'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
