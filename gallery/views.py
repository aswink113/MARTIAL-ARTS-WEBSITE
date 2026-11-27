from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404
from .models import GalleryCategory, GalleryItem


def gallery_list_view(request, slug=None):
    """Gallery listing with category filter chips and lightbox support."""
    categories = GalleryCategory.objects.filter(is_active=True)
    active_category = None

    items = GalleryItem.objects.filter(
        is_published=True,
        minor_consent_verified=True,
    ).select_related('category')

    if slug:
        active_category = get_object_or_404(GalleryCategory, slug=slug, is_active=True)
        items = items.filter(category=active_category)

    paginator = Paginator(items, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'public/gallery.html', {
        'categories': categories,
        'active_category': active_category,
        'page_obj': page_obj,
        'items': page_obj.object_list,
        'active_page': 'gallery',
    })
