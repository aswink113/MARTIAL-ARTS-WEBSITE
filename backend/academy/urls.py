from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AcademySettingsView,
    CourseViewSet,
    InstructorViewSet,
    ClassScheduleViewSet,
    FeeInformationViewSet,
    GalleryItemViewSet,
    AchievementViewSet,
    AdmissionEnquiryCreateView
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'instructors', InstructorViewSet, basename='instructor')
router.register(r'schedules', ClassScheduleViewSet, basename='schedule')
router.register(r'fees', FeeInformationViewSet, basename='fee')
router.register(r'gallery', GalleryItemViewSet, basename='gallery')
router.register(r'achievements', AchievementViewSet, basename='achievement')

urlpatterns = [
    path('settings/', AcademySettingsView.as_view(), name='academy-settings'),
    path('admission-enquiries/', AdmissionEnquiryCreateView.as_view(), name='admission-enquiry-create'),
    path('', include(router.urls)),
]
