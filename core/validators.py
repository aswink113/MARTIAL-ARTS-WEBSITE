from django.core.exceptions import ValidationError
from PIL import Image
import os


ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


def validate_safe_image(file_obj):
    """Validate uploaded image extension, size, and binary integrity."""
    if not file_obj:
        return
    ext = os.path.splitext(file_obj.name)[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError(
            f'Unsupported image format ({ext}). Allowed formats: JPG, JPEG, PNG, WEBP.'
        )
    if file_obj.size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError('Image file size must not exceed 5 MB.')
    try:
        pos = file_obj.tell()
        img = Image.open(file_obj)
        img.verify()
        file_obj.seek(pos)
    except Exception:
        raise ValidationError('Uploaded file is not a valid image.')
