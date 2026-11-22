from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from academy.models import Course, ClassSchedule, AdmissionEnquiry

def get_next_staff_id():
    """
    Finds the last created staff member with an STF-xxx ID,
    extracts the highest numerical sequence, and returns the next ID (e.g. STF-004).
    """
    staff_members = StaffMember.objects.filter(staff_id__startswith='STF-')
    max_num = 0
    for s in staff_members:
        try:
            val = s.staff_id.replace('STF-', '').strip()
            num = int(val)
            if num > max_num:
                max_num = num
        except (ValueError, TypeError):
            pass
    if max_num == 0:
        max_num = StaffMember.objects.count()
    return f"STF-{max_num + 1:03d}"


def get_next_student_id():
    """
    Finds the last created student with an STU-xxxx ID,
    extracts the highest numerical sequence, and returns the next ID (e.g. STU-1004).
    """
    students = StudentMember.objects.filter(student_id__startswith='STU-')
    max_num = 1000
    for s in students:
        try:
            val = s.student_id.replace('STU-', '').strip()
            num = int(val)
            if num > max_num:
                max_num = num
        except (ValueError, TypeError):
            pass
    if max_num == 1000:
        max_num = 1000 + StudentMember.objects.count()
    return f"STU-{max_num + 1}"


class Department(models.Model):
    name = models.CharField(max_length=120)
    code = models.CharField(max_length=30, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin / Dojo Owner'),
        ('instructor', 'Sensei / Staff'),
        ('student', 'Student / Martial Artist'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    custom_id = models.CharField(max_length=50, blank=True, default='')
    phone = models.CharField(max_length=30, blank=True)
    belt_rank = models.CharField(max_length=60, default='White Belt')
    profile_photo_url = models.URLField(blank=True, default='')
    emergency_contact = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_profiles')

    def __str__(self):
        return f"{self.user.username} [{self.custom_id or self.role}]"


class StaffMember(models.Model):
    ROLE_CHOICES = [
        ('instructor', 'Sensei / Instructor'),
        ('admin', 'Administrator / Manager'),
        ('staff', 'Support Staff / Front Desk'),
    ]

    staff_id = models.CharField(max_length=50, unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='staff_member')
    full_name = models.CharField(max_length=150)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='staff_members')
    designation = models.CharField(max_length=100)
    role_type = models.CharField(max_length=20, choices=ROLE_CHOICES, default='instructor')
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    joined_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['staff_id']

    def __str__(self):
        return f"[{self.staff_id}] {self.full_name} ({self.designation})"

    def save(self, *args, **kwargs):
        if not self.staff_id:
            self.staff_id = get_next_staff_id()
        super().save(*args, **kwargs)


class StudentMember(models.Model):
    FEE_STATUS_CHOICES = [
        ('Paid', 'Paid'),
        ('Due', 'Due'),
        ('Pending', 'Pending'),
        ('Overdue', 'Overdue'),
    ]

    BELT_CHOICES = [
        ('White Belt', 'White Belt'),
        ('Yellow Belt', 'Yellow Belt'),
        ('Orange Belt', 'Orange Belt'),
        ('Green Belt', 'Green Belt'),
        ('Blue Belt', 'Blue Belt'),
        ('Purple Belt', 'Purple Belt'),
        ('Brown Belt', 'Brown Belt'),
        ('Black Belt (1st Dan)', 'Black Belt (1st Dan)'),
        ('Black Belt (2nd Dan+)', 'Black Belt (2nd Dan+)'),
    ]

    student_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='student_member')
    full_name = models.CharField(max_length=150)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    enquiry = models.ForeignKey(AdmissionEnquiry, on_delete=models.SET_NULL, null=True, blank=True, related_name='member_conversion')
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, related_name='students')
    batch = models.ForeignKey(ClassSchedule, on_delete=models.SET_NULL, null=True, blank=True, related_name='enrolled_students')
    guardian_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    date_of_birth = models.DateField(null=True, blank=True)
    joined_date = models.DateField(auto_now_add=True)
    current_belt = models.CharField(max_length=60, choices=BELT_CHOICES, default='White Belt')
    fee_status = models.CharField(max_length=30, choices=FEE_STATUS_CHOICES, default='Paid')
    last_fee_paid_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['student_id', 'full_name']

    def __str__(self):
        return f"[{self.student_id or 'NO-ID'}] {self.full_name} ({self.current_belt})"

    def save(self, *args, **kwargs):
        if not self.student_id:
            self.student_id = get_next_student_id()
        super().save(*args, **kwargs)


class Attendance(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Excused', 'Excused'),
        ('Late', 'Late'),
    ]

    student = models.ForeignKey(StudentMember, on_delete=models.CASCADE, related_name='attendance_records')
    schedule = models.ForeignKey(ClassSchedule, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Present')
    check_in = models.CharField(max_length=20, default='09:30 AM', blank=True)
    check_out = models.CharField(max_length=20, default='11:00 AM', blank=True)
    training_time = models.CharField(max_length=20, default='1h 30m', blank=True)
    flag = models.CharField(max_length=30, default='On Time', blank=True)
    remarks = models.CharField(max_length=200, blank=True)
    marked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        unique_together = ('student', 'date', 'schedule')
        ordering = ['-date']

    def __str__(self):
        return f"{self.student.full_name} - {self.date}: {self.status}"


class StaffPunchLog(models.Model):
    STATUS_CHOICES = [
        ('Punched In', 'Punched In'),
        ('Punched Out', 'Punched Out'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='punch_logs')
    staff = models.ForeignKey(StaffMember, on_delete=models.SET_NULL, null=True, blank=True, related_name='punch_logs')
    date = models.DateField(default=timezone.now)
    punch_in = models.DateTimeField(default=timezone.now)
    punch_out = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Punched In')
    remarks = models.CharField(max_length=200, blank=True, default='')

    class Meta:
        ordering = ['-punch_in']

    def __str__(self):
        return f"{self.user.username} ({self.date}): {self.status}"


class StaffAttendance(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Late', 'Late'),
        ('Half Day', 'Half Day'),
        ('Leave', 'Leave'),
    ]

    staff = models.ForeignKey(StaffMember, on_delete=models.CASCADE, related_name='daily_attendance_records')
    date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Present')
    check_in = models.CharField(max_length=20, default='09:04 AM', blank=True)
    check_out = models.CharField(max_length=20, default='05:06 PM', blank=True)
    total_in_time = models.CharField(max_length=20, default='8h 2m', blank=True)
    break_time = models.CharField(max_length=50, default='45 min (1:15 PM - 2:00 PM)', blank=True)
    total_working_time = models.CharField(max_length=20, default='7h 17m', blank=True)
    flag = models.CharField(max_length=30, default='On Time', blank=True)
    remarks = models.CharField(max_length=200, blank=True, default='')
    marked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('staff', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.staff.full_name} - {self.date}: {self.status}"


class FeePayment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('Cash', 'Cash'),
        ('Card', 'Credit / Debit Card'),
        ('UPI', 'UPI / Online Transfer'),
        ('Bank Transfer', 'Bank Wire / ACH'),
        ('Cheque', 'Cheque'),
    ]
    PAYMENT_STATUS_CHOICES = [
        ('Paid', 'Paid'),
        ('Pending', 'Pending'),
        ('Due', 'Due'),
        ('Overdue', 'Overdue'),
        ('Refunded', 'Refunded'),
    ]

    student = models.ForeignKey(StudentMember, on_delete=models.CASCADE, related_name='fee_payments')
    receipt_number = models.CharField(max_length=60, unique=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=99.00)
    payment_date = models.DateField(default=timezone.now)
    payment_method = models.CharField(max_length=30, choices=PAYMENT_METHOD_CHOICES, default='Cash')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='Paid')
    billing_month = models.CharField(max_length=40, default='November 2026')
    notes = models.CharField(max_length=255, blank=True, default='')
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-payment_date', '-created_at']

    def __str__(self):
        return f"{self.receipt_number} - {self.student.full_name} (${self.amount})"

    def save(self, *args, **kwargs):
        if not self.receipt_number:
            last = FeePayment.objects.order_by('-id').first()
            next_num = (last.id + 1001) if last else 1001
            self.receipt_number = f"REC-{next_num}"
        super().save(*args, **kwargs)


class BeltPromotion(models.Model):
    student = models.ForeignKey(StudentMember, on_delete=models.CASCADE, related_name='belt_promotions')
    from_belt = models.CharField(max_length=60)
    to_belt = models.CharField(max_length=60)
    promotion_date = models.DateField(default=timezone.now)
    examiner = models.ForeignKey(StaffMember, on_delete=models.SET_NULL, null=True, blank=True)
    certificate_number = models.CharField(max_length=60, blank=True, default='')
    remarks = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-promotion_date', '-created_at']

    def __str__(self):
        return f"{self.student.full_name}: {self.from_belt} -> {self.to_belt}"

