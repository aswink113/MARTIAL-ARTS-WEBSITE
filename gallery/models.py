from django.db import models
from django.utils.text import slugify
from core.validators import validate_safe_image


class GalleryCategory(models.Model):
    """Gallery categories: Training Photos, Videos, Competition Photos, Certificates & Awards."""

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    sort_order = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = 'Gallery Category'
        verbose_name_plural = 'Gallery Categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            counter = 1
            while GalleryCategory.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base}-{counter}'
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class GalleryItem(models.Model):
    """Photo or embedded video item displayed in the academy gallery."""

    MEDIA_TYPES = [
        ('photo', 'Photo'),
        ('video', 'Video Link (YouTube / Vimeo)'),
    ]

    category = models.ForeignKey(
        GalleryCategory,
        on_delete=models.CASCADE,
        related_name='items',
    )
    media_type = models.CharField(max_length=20, choices=MEDIA_TYPES, default='photo')
    title = models.CharField(max_length=150)
    image = models.ImageField(
        upload_to='gallery/',
        blank=True,
        null=True,
        validators=[validate_safe_image],
        help_text='Upload photo or video thumbnail (JPG, PNG, WEBP up to 5 MB).',
    )
    video_url = models.URLField(
        blank=True,
        help_text='Optional YouTube or Vimeo link for video items.',
    )
    caption = models.CharField(max_length=280, blank=True)
    event_date = models.DateField(null=True, blank=True)
    minor_consent_verified = models.BooleanField(
        default=True,
        help_text='Confirm parent/guardian image consent if identifiable minors appear.',
    )
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-event_date', '-created_at']
        verbose_name = 'Gallery Item'
        verbose_name_plural = 'Gallery Items'
        indexes = [models.Index(fields=['is_published', 'category'])]

    def embed_url(self):
        """Convert standard YouTube or Vimeo URL to a safe embed URL."""
        url = (self.video_url or '').strip()
        if not url:
            return ''
        if 'youtube.com/watch?v=' in url:
            vid = url.split('watch?v=')[1].split('&')[0]
            return f'https://www.youtube.com/embed/{vid}'
        if 'youtu.be/' in url:
            vid = url.split('youtu.be/')[1].split('?')[0]
            return f'https://www.youtube.com/embed/{vid}'
        if 'vimeo.com/' in url and 'player.vimeo.com' not in url:
            vid = url.rstrip('/').split('/')[-1]
            return f'https://player.vimeo.com/video/{vid}'
        return url

    def __str__(self):
        return self.title
