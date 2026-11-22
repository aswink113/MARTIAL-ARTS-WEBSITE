from rest_framework import serializers
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

class AcademySettingsSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    banner = serializers.SerializerMethodField()

    class Meta:
        model = AcademySettings
        fields = '__all__'

    def get_logo(self, obj):
        if obj.academy_logo:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.academy_logo.url) if request else obj.academy_logo.url
        return obj.logo_url

    def get_banner(self, obj):
        if obj.hero_banner:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.hero_banner.url) if request else obj.hero_banner.url
        return obj.hero_banner_url


class ClassScheduleSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    formatted_start_time = serializers.SerializerMethodField()
    formatted_end_time = serializers.SerializerMethodField()

    class Meta:
        model = ClassSchedule
        fields = [
            'id', 'course', 'course_title', 'batch_name', 
            'age_category', 'training_day', 'start_time', 'end_time',
            'formatted_start_time', 'formatted_end_time', 'is_active'
        ]

    def get_formatted_start_time(self, obj):
        return obj.start_time.strftime('%I:%M %p') if obj.start_time else ''

    def get_formatted_end_time(self, obj):
        return obj.end_time.strftime('%I:%M %p') if obj.end_time else ''


class FeeInformationSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = FeeInformation
        fields = ['id', 'course', 'course_title', 'age_category', 'fee_amount', 'fee_period', 'additional_notes']


class CourseListSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()
    schedules = ClassScheduleSerializer(many=True, read_only=True)
    fees = FeeInformationSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'short_description', 'description',
            'image', 'image_url', 'image_display', 'age_group',
            'duration', 'monthly_fee', 'is_active', 'display_order',
            'schedules', 'fees', 'created_at'
        ]

    def get_image_display(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.image_url


class CourseDetailSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()
    schedules = ClassScheduleSerializer(many=True, read_only=True)
    fees = FeeInformationSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

    def get_image_display(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.image_url


class InstructorSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()

    class Meta:
        model = Instructor
        fields = [
            'id', 'name', 'designation', 'biography', 'qualifications',
            'experience', 'profile_image', 'image_url', 'image_display',
            'is_head_coach', 'is_active', 'display_order', 'created_at'
        ]

    def get_image_display(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.profile_image.url) if request else obj.profile_image.url
        return obj.image_url


class GalleryItemSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()

    class Meta:
        model = GalleryItem
        fields = [
            'id', 'title', 'category', 'image', 'image_url',
            'image_display', 'video_url', 'description', 'published_date', 'is_active'
        ]

    def get_image_display(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.image_url


class AchievementSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()
    certificate_display = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = [
            'id', 'title', 'description', 'achievement_date',
            'image', 'image_url', 'image_display',
            'certificate', 'certificate_url', 'certificate_display', 'is_active'
        ]

    def get_image_display(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.image_url

    def get_certificate_display(self, obj):
        if obj.certificate:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.certificate.url) if request else obj.certificate.url
        return obj.certificate_url


class AdmissionEnquirySerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = AdmissionEnquiry
        fields = [
            'id', 'student_name', 'student_age', 'guardian_name',
            'phone', 'email', 'course', 'course_title',
            'preferred_batch', 'message', 'enquiry_status', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'enquiry_status', 'notes', 'created_at']

    def validate_student_age(self, value):
        if value < 4 or value > 99:
            raise serializers.ValidationError("Student age must be between 4 and 99 years.")
        return value

    def validate_phone(self, value):
        cleaned = ''.join(c for c in value if c.isdigit() or c in '+-() ')
        if len(cleaned.replace(' ', '')) < 7:
            raise serializers.ValidationError("Please provide a valid contact number.")
        return cleaned
