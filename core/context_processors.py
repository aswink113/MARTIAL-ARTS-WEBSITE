from .models import SiteSettings


def site_settings(request):
    """Inject global academy settings into all Django templates."""
    settings_obj = SiteSettings.objects.first()
    if settings_obj is None:
        settings_obj = SiteSettings(academy_name='Greentrack Martial Arts')
    return {'site_settings': settings_obj}
