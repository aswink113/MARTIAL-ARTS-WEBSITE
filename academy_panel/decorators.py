from functools import wraps
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect


def admin_panel_required(view_func):
    """Ensure the user is logged in as the Academy Admin."""
    @login_required
    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        if not request.user.is_active or (not request.user.is_staff and not request.user.is_superuser):
            messages.error(request, 'Please sign in with your Academy Admin account.')
            return redirect('academy_panel:login')
        return view_func(request, *args, **kwargs)

    return _wrapped
