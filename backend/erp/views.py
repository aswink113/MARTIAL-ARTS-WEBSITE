from rest_framework import generics, viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from datetime import date, datetime, timedelta
from .models import (
    UserProfile, 
    StudentMember, 
    StaffMember, 
    Department, 
    Attendance, 
    StaffPunchLog,
    StaffAttendance,
    FeePayment,
    BeltPromotion,
    get_next_student_id,
    get_next_staff_id
)
from .serializers import (
    CustomTokenObtainPairSerializer,
    DepartmentSerializer,
    StaffMemberSerializer,
    StudentMemberSerializer,
    AttendanceSerializer,
    StaffPunchLogSerializer,
    StaffAttendanceSerializer,
    FeePaymentSerializer,
    BeltPromotionSerializer
)
from academy.models import Course, ClassSchedule, AdmissionEnquiry
from academy.serializers import AdmissionEnquirySerializer

class CustomLoginView(TokenObtainPairView):
    """
    Universal Single Login endpoint.
    Accepts Email, Student ID, Staff ID, or Username.
    """
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)
        role = 'admin' if user.is_superuser else profile.role

        custom_id = profile.custom_id
        department_name = profile.department.name if profile.department else 'General'

        if hasattr(user, 'staff_member') and user.staff_member:
            custom_id = user.staff_member.staff_id
            if user.staff_member.department:
                department_name = user.staff_member.department.name
        elif hasattr(user, 'student_member') and user.student_member:
            custom_id = user.student_member.student_id
            if user.student_member.department:
                department_name = user.student_member.department.name

        student_info = None
        if hasattr(user, 'student_member') and user.student_member:
            student = user.student_member
            student_info = {
                'id': student.id,
                'student_id': student.student_id,
                'full_name': student.full_name,
                'course': student.course.title if student.course else 'N/A',
                'batch': student.batch.batch_name if student.batch else 'General Batch',
                'current_belt': student.current_belt,
                'fee_status': student.fee_status,
            }

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': role,
            'custom_id': custom_id,
            'department': department_name,
            'belt_rank': profile.belt_rank,
            'phone': profile.phone,
            'profile_photo_url': profile.profile_photo_url,
            'student_info': student_info
        })


class ERPDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)
        role = 'admin' if user.is_superuser else profile.role

        today = timezone.now().date()
        non_admin_staff_qs = StaffMember.objects.filter(is_active=True).exclude(
            models.Q(role_type='admin') |
            models.Q(user__is_superuser=True) |
            models.Q(user__username='admin') |
            models.Q(staff_id='STF-001')
        )
        total_non_admin_staff = non_admin_staff_qs.count()

        staff_att_today = StaffAttendance.objects.filter(date=today).exclude(
            models.Q(staff__role_type='admin') |
            models.Q(staff__user__is_superuser=True) |
            models.Q(staff__staff_id='STF-001')
        )
        staff_present = staff_att_today.filter(status='Present').count()
        staff_absent = staff_att_today.filter(status='Absent').count()
        staff_late_or_leave = staff_att_today.filter(status__in=['Late', 'Half Day', 'Leave']).count()

        student_att_today = Attendance.objects.filter(date=today)
        student_present = student_att_today.filter(status='Present').count()
        student_absent = student_att_today.filter(status='Absent').count()
        student_other = student_att_today.filter(status__in=['Late', 'Excused']).count()

        stats = {
            'role': role,
            'user_name': user.get_full_name() or user.username,
            'custom_id': profile.custom_id,
            'total_courses': Course.objects.filter(is_active=True).count(),
            'total_batches': ClassSchedule.objects.filter(is_active=True).count(),
            'total_students': StudentMember.objects.filter(is_active=True).count(),
            'total_staff': StaffMember.objects.filter(is_active=True).count(),
            'total_non_admin_staff': total_non_admin_staff,
            'total_departments': Department.objects.filter(is_active=True).count(),
            'staff_attendance_today': {
                'present': staff_present,
                'absent': staff_absent,
                'other': staff_late_or_leave,
                'total': total_non_admin_staff
            },
            'student_attendance_today': {
                'present': student_present,
                'absent': student_absent,
                'other': student_other,
                'total': StudentMember.objects.filter(is_active=True).count()
            }
        }

        if role == 'admin':
            stats.update({
                'total_enquiries': AdmissionEnquiry.objects.count(),
                'new_enquiries': AdmissionEnquiry.objects.filter(enquiry_status='New').count(),
                'in_review_enquiries': AdmissionEnquiry.objects.filter(enquiry_status='In Review').count(),
                'contacted_enquiries': AdmissionEnquiry.objects.filter(enquiry_status='Contacted').count(),
                'enrolled_enquiries': AdmissionEnquiry.objects.filter(enquiry_status='Enrolled').count(),
                'fees_due_count': StudentMember.objects.filter(fee_status__in=['Due', 'Overdue']).count(),
                'recent_enquiries': AdmissionEnquirySerializer(
                    AdmissionEnquiry.objects.all()[:5], many=True
                ).data,
            })

        elif role == 'instructor':
            stats.update({
                'assigned_batches': [
                    {
                        'id': s.id,
                        'name': s.batch_name,
                        'course': s.course.title,
                        'day': s.training_day,
                        'time': f"{s.start_time.strftime('%I:%M %p')} - {s.end_time.strftime('%I:%M %p')}",
                        'students_count': s.enrolled_students.count()
                    }
                    for s in ClassSchedule.objects.filter(is_active=True)[:6]
                ],
            })

        elif role == 'student':
            student = getattr(user, 'student_member', None)
            if not student:
                student = StudentMember.objects.filter(email=user.email).first()

            if student:
                attendance_total = Attendance.objects.filter(student=student).count()
                attendance_present = Attendance.objects.filter(student=student, status='Present').count()
                rate = round((attendance_present / attendance_total * 100), 1) if attendance_total > 0 else 100.0

                stats.update({
                    'student_id': student.student_id,
                    'full_name': student.full_name,
                    'course': student.course.title if student.course else 'All Disciplines',
                    'current_belt': student.current_belt,
                    'fee_status': student.fee_status,
                    'joined_date': student.joined_date,
                    'batch': {
                        'name': student.batch.batch_name if student.batch else 'Regular Batch',
                        'timing': f"{student.batch.training_day} ({student.batch.start_time.strftime('%I:%M %p')} - {student.batch.end_time.strftime('%I:%M %p')})" if student.batch else 'Regular Training Days'
                    },
                    'attendance_rate': rate,
                })

        return Response(stats)


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    Department CRUD Management for Admins.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()


class StaffMemberViewSet(viewsets.ModelViewSet):
    """
    Staff and Sensei Management with Credentials Setup.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StaffMemberSerializer
    queryset = StaffMember.objects.all().select_related('department', 'user')

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def next_id(self, request):
        return Response({'next_staff_id': get_next_staff_id()})

    def create(self, request, *args, **kwargs):
        data = request.data
        staff_id = data.get('staff_id', '').strip() or get_next_staff_id()
        email = data.get('email', '').strip()
        username = data.get('username', '').strip() or staff_id or email.split('@')[0]
        password = data.get('password', 'warrior123')
        full_name = data.get('full_name', '')
        role_type = data.get('role_type', 'instructor')

        # Check or create User
        user = User.objects.filter(username=username).first()
        if not user and email:
            user = User.objects.filter(email=email).first()

        if not user:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=full_name.split()[0] if full_name else '',
                last_name=' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else ''
            )
        else:
            user.set_password(password)
            user.save()

        # Update UserProfile role
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.role = role_type
        profile.custom_id = staff_id
        profile.save()

        # Create StaffMember record
        staff = StaffMember.objects.create(
            user=user,
            staff_id=staff_id,
            full_name=full_name,
            department_id=data.get('department'),
            designation=data.get('designation', 'Instructor'),
            role_type=role_type,
            phone=data.get('phone', ''),
            email=email,
            salary=data.get('salary', 0.00),
            notes=data.get('notes', '')
        )

        serializer = self.get_serializer(staff)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def manage_credentials(self, request, pk=None):
        staff = self.get_object()
        new_password = request.data.get('password')
        new_username = request.data.get('username')
        role_type = request.data.get('role_type', staff.role_type)

        if not staff.user:
            staff.user = User.objects.create_user(
                username=new_username or staff.staff_id,
                email=staff.email,
                password=new_password or 'warrior123'
            )
            staff.save()
        else:
            if new_username:
                staff.user.username = new_username
            if new_password:
                staff.user.set_password(new_password)
            staff.user.save()

        profile, _ = UserProfile.objects.get_or_create(user=staff.user)
        profile.role = role_type
        profile.custom_id = staff.staff_id
        profile.save()

        staff.role_type = role_type
        staff.save()

        return Response({
            'success': True,
            'message': f"Credentials updated for {staff.full_name}. Login using Staff ID '{staff.staff_id}' or Email '{staff.email}'."
        })

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.user:
            if 'full_name' in serializer.validated_data:
                names = instance.full_name.strip().split()
                instance.user.first_name = names[0] if names else ''
                instance.user.last_name = ' '.join(names[1:]) if len(names) > 1 else ''
            if 'email' in serializer.validated_data:
                instance.user.email = instance.email
            instance.user.save()
            profile, _ = UserProfile.objects.get_or_create(user=instance.user)
            profile.role = instance.role_type
            profile.phone = instance.phone
            profile.department = instance.department
            profile.save()


class ERPStudentViewSet(viewsets.ModelViewSet):
    """
    Student Members CRUD & Credential Management.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentMemberSerializer
    queryset = StudentMember.objects.all().select_related('course', 'batch', 'department', 'user')

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def next_id(self, request):
        return Response({'next_student_id': get_next_student_id()})

    def create(self, request, *args, **kwargs):
        data = request.data
        full_name = data.get('full_name', '')
        email = data.get('email', '').strip()
        student_id = data.get('student_id', '').strip() or get_next_student_id()
        password = data.get('password', 'student123')

        # Create or update linked user
        user = User.objects.filter(username=student_id).first()
        if not user and email:
            user = User.objects.filter(email=email).first()

        if not user:
            user = User.objects.create_user(
                username=student_id,
                email=email,
                password=password,
                first_name=full_name.split()[0] if full_name else '',
                last_name=' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else ''
            )
        else:
            user.set_password(password)
            user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.role = 'student'
        profile.custom_id = student_id
        profile.save()

        student = StudentMember.objects.create(
            user=user,
            student_id=student_id,
            full_name=full_name,
            department_id=data.get('department'),
            course_id=data.get('course'),
            batch_id=data.get('batch'),
            guardian_name=data.get('guardian_name', ''),
            phone=data.get('phone', ''),
            email=email,
            current_belt=data.get('current_belt', 'White Belt'),
            fee_status=data.get('fee_status', 'Paid'),
            notes=data.get('notes', '')
        )

        serializer = self.get_serializer(student)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def manage_credentials(self, request, pk=None):
        student = self.get_object()
        new_password = request.data.get('password')
        new_username = request.data.get('username')

        if not student.user:
            student.user = User.objects.create_user(
                username=new_username or student.student_id or f"STU-{student.id}",
                email=student.email,
                password=new_password or 'student123'
            )
            student.save()
        else:
            if new_username:
                student.user.username = new_username
            if new_password:
                student.user.set_password(new_password)
            student.user.save()

        profile, _ = UserProfile.objects.get_or_create(user=student.user)
        profile.role = 'student'
        profile.custom_id = student.student_id
        profile.save()

        return Response({
            'success': True,
            'message': f"Credentials updated for {student.full_name}. Login using Student ID '{student.student_id}' or Email '{student.email}'."
        })

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.user:
            if 'full_name' in serializer.validated_data:
                names = instance.full_name.strip().split()
                instance.user.first_name = names[0] if names else ''
                instance.user.last_name = ' '.join(names[1:]) if len(names) > 1 else ''
            if 'email' in serializer.validated_data:
                instance.user.email = instance.email
            instance.user.save()
            profile, _ = UserProfile.objects.get_or_create(user=instance.user)
            profile.phone = instance.phone
            profile.department = instance.department
            profile.belt_rank = instance.current_belt
            profile.save()


class ERPEnquiryViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AdmissionEnquirySerializer

    def get_queryset(self):
        queryset = AdmissionEnquiry.objects.all().select_related('course')
        status_param = self.request.query_params.get('status')
        if status_param and status_param != 'All':
            queryset = queryset.filter(enquiry_status=status_param)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(student_name__icontains=search)
        return queryset

    def partial_update(self, request, *args, **kwargs):
        enquiry = self.get_object()
        new_status = request.data.get('enquiry_status')
        if new_status:
            enquiry.enquiry_status = new_status
        notes = request.data.get('notes')
        if notes is not None:
            enquiry.notes = notes
        enquiry.save()

        # If Enrolled, auto-create StudentMember with credentials!
        if new_status == 'Enrolled' and request.data.get('create_member', True):
            if not StudentMember.objects.filter(enquiry=enquiry).exists():
                student_id = get_next_student_id()
                
                # Create user account for the new student
                user, created = User.objects.get_or_create(
                    username=student_id,
                    defaults={'email': enquiry.email, 'first_name': enquiry.student_name}
                )
                if created:
                    user.set_password('student123')
                    user.save()

                profile, _ = UserProfile.objects.get_or_create(user=user)
                profile.role = 'student'
                profile.custom_id = student_id
                profile.save()

                StudentMember.objects.create(
                    user=user,
                    student_id=student_id,
                    full_name=enquiry.student_name,
                    enquiry=enquiry,
                    course=enquiry.course,
                    guardian_name=enquiry.guardian_name,
                    phone=enquiry.phone,
                    email=enquiry.email,
                    current_belt='White Belt',
                    fee_status='Paid'
                )

        serializer = self.get_serializer(enquiry)
        return Response(serializer.data)


class ERPAttendanceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        queryset = Attendance.objects.all().select_related('student', 'student__course', 'student__department', 'schedule')
        date_param = self.request.query_params.get('date')
        days_param = self.request.query_params.get('days')
        personal = self.request.query_params.get('personal')

        if personal == 'true' or (hasattr(self.request.user, 'student_member') and not self.request.user.is_superuser):
            queryset = queryset.filter(student__user=self.request.user)

        if date_param:
            queryset = queryset.filter(date=date_param)
        elif days_param and days_param != 'all':
            try:
                start_date = timezone.now().date() - timedelta(days=int(days_param))
                queryset = queryset.filter(date__gte=start_date)
            except ValueError:
                pass

        return queryset.order_by('-date', 'student__student_id')

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            saved = []
            for item in request.data:
                student_id = item.get('student')
                schedule_id = item.get('schedule')
                att_date = item.get('date', timezone.now().date())
                att_status = item.get('status', 'Present')
                remarks = item.get('remarks', '')
                check_in = item.get('check_in', '09:30 AM')
                check_out = item.get('check_out', '11:00 AM')
                training_time = item.get('training_time', '1h 30m')
                flag = item.get('flag', 'On Time')

                record, _ = Attendance.objects.update_or_create(
                    student_id=student_id,
                    date=att_date,
                    schedule_id=schedule_id,
                    defaults={
                        'status': att_status,
                        'check_in': check_in,
                        'check_out': check_out,
                        'training_time': training_time,
                        'flag': flag,
                        'remarks': remarks
                    }
                )
                saved.append(AttendanceSerializer(record).data)
            return Response(saved, status=status.HTTP_201_CREATED)
        return super().create(request, *args, **kwargs)


class StaffAttendanceViewSet(viewsets.ModelViewSet):
    """
    Manual Staff Attendance Register ViewSet.
    ADMINS DO NOT HAVE ANY ATTENDANCE (excluded completely).
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StaffAttendanceSerializer

    def get_queryset(self):
        queryset = StaffAttendance.objects.all().select_related('staff', 'staff__department')
        # Admin is explicitly excluded from staff attendance
        queryset = queryset.exclude(
            models.Q(staff__role_type='admin') |
            models.Q(staff__user__is_superuser=True) |
            models.Q(staff__user__username='admin') |
            models.Q(staff__staff_id='STF-001')
        )

        date_param = self.request.query_params.get('date')
        days_param = self.request.query_params.get('days')
        personal = self.request.query_params.get('personal')

        if personal == 'true' or (hasattr(self.request.user, 'staff_member') and not self.request.user.is_superuser and self.request.user.username != 'admin'):
            queryset = queryset.filter(staff__user=self.request.user)

        if date_param:
            queryset = queryset.filter(date=date_param)
        elif days_param and days_param != 'all':
            try:
                start_date = timezone.now().date() - timedelta(days=int(days_param))
                queryset = queryset.filter(date__gte=start_date)
            except ValueError:
                pass

        return queryset.order_by('-date', 'staff__staff_id')

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            saved = []
            for item in request.data:
                staff_id = item.get('staff')
                att_date = item.get('date', timezone.now().date())
                att_status = item.get('status', 'Present')
                remarks = item.get('remarks', '')
                check_in = item.get('check_in', '09:04:16 AM')
                check_out = item.get('check_out', '05:06:21 PM')
                total_in_time = item.get('total_in_time', '8h 2m')
                break_time = item.get('break_time', '45 min (1:15 PM - 2:00 PM)')
                total_working_time = item.get('total_working_time', '7h 17m')
                flag = item.get('flag', 'On Time')

                # Check staff member - ensure it is NOT an admin
                staff_obj = StaffMember.objects.filter(id=staff_id).first()
                if not staff_obj:
                    continue
                if (staff_obj.role_type == 'admin' or 
                    (staff_obj.user and staff_obj.user.is_superuser) or 
                    (staff_obj.user and staff_obj.user.username == 'admin') or 
                    staff_obj.staff_id == 'STF-001'):
                    continue

                record, _ = StaffAttendance.objects.update_or_create(
                    staff=staff_obj,
                    date=att_date,
                    defaults={
                        'status': att_status,
                        'check_in': check_in,
                        'check_out': check_out,
                        'total_in_time': total_in_time,
                        'break_time': break_time,
                        'total_working_time': total_working_time,
                        'flag': flag,
                        'remarks': remarks,
                        'marked_by': request.user
                    }
                )
                saved.append(StaffAttendanceSerializer(record).data)
            return Response(saved, status=status.HTTP_201_CREATED)
        return super().create(request, *args, **kwargs)


class PunchStatusView(APIView):
    """
    Get the current user's live punch status for today.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        staff = getattr(user, 'staff_member', None)
        if not staff:
            staff = StaffMember.objects.filter(email=user.email).first()

        # Find today's latest punch log
        log = StaffPunchLog.objects.filter(
            models.Q(user=user) | (models.Q(staff=staff) if staff else models.Q(user=user)),
            date=today
        ).order_by('-punch_in').first()

        if log and log.status == 'Punched In' and log.punch_out is None:
            return Response({
                'punched_in': True,
                'punch_time': log.punch_in.strftime('%I:%M %p'),
                'punch_out_time': None,
                'status': 'Punched In',
                'date': str(today),
                'log_id': log.id
            })
        elif log:
            return Response({
                'punched_in': False,
                'punch_time': log.punch_in.strftime('%I:%M %p'),
                'punch_out_time': log.punch_out.strftime('%I:%M %p') if log.punch_out else None,
                'status': log.status,
                'date': str(today),
                'log_id': log.id
            })
        else:
            return Response({
                'punched_in': False,
                'punch_time': None,
                'punch_out_time': None,
                'status': 'Not Punched',
                'date': str(today),
                'log_id': None
            })


class PunchToggleView(APIView):
    """
    Record Punch In / Punch Out for the authenticated user/staff member.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        now = timezone.now()
        today = now.date()
        staff = getattr(user, 'staff_member', None)
        if not staff:
            staff = StaffMember.objects.filter(email=user.email).first()

        open_log = StaffPunchLog.objects.filter(
            models.Q(user=user) | (models.Q(staff=staff) if staff else models.Q(user=user)),
            date=today,
            punch_out__isnull=True
        ).order_by('-punch_in').first()

        if open_log:
            open_log.punch_out = now
            open_log.status = 'Punched Out'
            open_log.remarks = request.data.get('remarks', 'Punched out via ERP portal')
            open_log.save()
            return Response({
                'punched_in': False,
                'punch_time': open_log.punch_in.strftime('%I:%M %p'),
                'punch_out_time': open_log.punch_out.strftime('%I:%M %p'),
                'status': 'Punched Out',
                'message': f"Punched Out successfully at {open_log.punch_out.strftime('%I:%M %p')}."
            })
        else:
            new_log = StaffPunchLog.objects.create(
                user=user,
                staff=staff,
                date=today,
                punch_in=now,
                status='Punched In',
                remarks=request.data.get('remarks', 'Punched in via ERP portal')
            )
            return Response({
                'punched_in': True,
                'punch_time': new_log.punch_in.strftime('%I:%M %p'),
                'punch_out_time': None,
                'status': 'Punched In',
                'message': f"Punched In successfully at {new_log.punch_in.strftime('%I:%M %p')}."
            })


class WorkforceAttendanceView(APIView):
    """
    Real-time Live Workforce Attendance Table for Today or specific date.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        date_str = request.query_params.get('date')
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                target_date = timezone.now().date()
        else:
            target_date = timezone.now().date()

        staff_members = StaffMember.objects.filter(is_active=True).select_related('department', 'user').order_by('staff_id')
        records = []
        punched_in_count = 0
        punched_out_count = 0

        for s in staff_members:
            log = StaffPunchLog.objects.filter(
                models.Q(staff=s) | (models.Q(user=s.user) if s.user else models.Q(staff=s)),
                date=target_date
            ).order_by('-punch_in').first()

            if log:
                is_in = (log.status == 'Punched In' and log.punch_out is None)
                if is_in:
                    punched_in_count += 1
                else:
                    punched_out_count += 1

                records.append({
                    'id': s.id,
                    'staff_id': s.staff_id,
                    'full_name': s.full_name,
                    'department_name': s.department.name if s.department else 'General Martial Arts',
                    'punch_in': log.punch_in.strftime('%I:%M %p') if log.punch_in else '--:-- --',
                    'punch_out': log.punch_out.strftime('%I:%M %p') if log.punch_out else '--:-- --',
                    'status': 'PUNCHED IN' if is_in else 'PUNCHED OUT',
                    'status_key': 'in' if is_in else 'out',
                    'raw_status': log.status
                })
            else:
                records.append({
                    'id': s.id,
                    'staff_id': s.staff_id,
                    'full_name': s.full_name,
                    'department_name': s.department.name if s.department else 'General Martial Arts',
                    'punch_in': '--:-- --',
                    'punch_out': '--:-- --',
                    'status': 'NOT PUNCHED',
                    'status_key': 'not_punched',
                    'raw_status': 'Not Punched'
                })

        total = len(staff_members)
        not_punched_count = total - (punched_in_count + punched_out_count)

        return Response({
            'date': str(target_date),
            'total_staff': total,
            'punched_in_count': punched_in_count,
            'punched_out_count': punched_out_count,
            'not_punched_count': max(0, not_punched_count),
            'records': records
        })


class FeePaymentViewSet(viewsets.ModelViewSet):
    queryset = FeePayment.objects.all().select_related('student', 'recorded_by')
    serializer_class = FeePaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get('student')
        status_filter = self.request.query_params.get('status')
        month = self.request.query_params.get('month')
        if student_id:
            qs = qs.filter(student_id=student_id)
        if status_filter and status_filter != 'All':
            qs = qs.filter(status=status_filter)
        if month:
            qs = qs.filter(billing_month=month)
        return qs

    def perform_create(self, serializer):
        payment = serializer.save(recorded_by=self.request.user)
        # Update student fee status if marked Paid
        if payment.status == 'Paid' and payment.student:
            payment.student.fee_status = 'Paid'
            payment.student.save(update_fields=['fee_status'])


class BeltPromotionViewSet(viewsets.ModelViewSet):
    queryset = BeltPromotion.objects.all().select_related('student', 'examiner')
    serializer_class = BeltPromotionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get('student')
        if student_id:
            qs = qs.filter(student_id=student_id)
        return qs

    def perform_create(self, serializer):
        promotion = serializer.save()
        # Automatically advance student's current belt rank
        if promotion.to_belt and promotion.student:
            promotion.student.current_belt = promotion.to_belt
            promotion.student.save(update_fields=['current_belt'])

