from rest_framework import generics, viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import (
    AcademySettings,
    Course,
    Instructor,
    ClassSchedule,
    FeeInformation,
    GalleryItem,
    Achievement,
    AdmissionEnquiry
)
from .serializers import (
    AcademySettingsSerializer,
    CourseListSerializer,
    CourseDetailSerializer,
    InstructorSerializer,
    ClassScheduleSerializer,
    FeeInformationSerializer,
    GalleryItemSerializer,
    AchievementSerializer,
    AdmissionEnquirySerializer
)

class AcademySettingsView(APIView):
    """
    Returns public academy settings, branding, contact info, and hero assets.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings = AcademySettings.load()
        serializer = AcademySettingsSerializer(settings, context={'request': request})
        return Response(serializer.data)


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List active courses or retrieve a single course by its unique slug.
    """
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Course.objects.filter(is_active=True).prefetch_related('schedules', 'fees')
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(title__icontains=category)
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer


class InstructorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List all active instructors and coaches.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = InstructorSerializer

    def get_queryset(self):
        queryset = Instructor.objects.filter(is_active=True)
        head_only = self.request.query_params.get('head_coach')
        if head_only and head_only.lower() in ('true', '1'):
            queryset = queryset.filter(is_head_coach=True)
        return queryset


class ClassScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List class schedules with optional filtering by course slug, training day, or age category.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = ClassScheduleSerializer

    def get_queryset(self):
        queryset = ClassSchedule.objects.filter(is_active=True).select_related('course')
        course_slug = self.request.query_params.get('course')
        if course_slug:
            queryset = queryset.filter(course__slug=course_slug)
        day = self.request.query_params.get('day')
        if day:
            queryset = queryset.filter(training_day__icontains=day)
        return queryset


class FeeInformationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List fee options with optional filtering by course.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = FeeInformationSerializer

    def get_queryset(self):
        queryset = FeeInformation.objects.select_related('course')
        course_slug = self.request.query_params.get('course')
        if course_slug:
            queryset = queryset.filter(course__slug=course_slug)
        return queryset


class GalleryItemViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List gallery items with category filter.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = GalleryItemSerializer

    def get_queryset(self):
        queryset = GalleryItem.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        if category and category.lower() != 'all':
            queryset = queryset.filter(category__iexact=category)
        return queryset


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List academy achievements and awards.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = AchievementSerializer
    queryset = Achievement.objects.filter(is_active=True)


class AdmissionEnquiryCreateView(generics.CreateAPIView):
    """
    Public admission enquiry submission endpoint.
    Saves student/guardian enquiry to PostgreSQL / DB and notifies admin.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = AdmissionEnquirySerializer
    queryset = AdmissionEnquiry.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            enquiry = serializer.save()
            return Response({
                'success': True,
                'message': 'Thank you! Your admission enquiry has been successfully submitted. Our sensei will reach out within 24 hours.',
                'enquiry_id': enquiry.id,
                'student_name': enquiry.student_name,
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
