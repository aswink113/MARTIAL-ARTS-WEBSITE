from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomLoginView,
    CurrentUserView,
    ERPDashboardStatsView,
    ERPEnquiryViewSet,
    ERPStudentViewSet,
    ERPAttendanceViewSet,
    StaffAttendanceViewSet,
    DepartmentViewSet,
    StaffMemberViewSet,
    FeePaymentViewSet,
    BeltPromotionViewSet,
    PunchStatusView,
    PunchToggleView,
    WorkforceAttendanceView
)

router = DefaultRouter()
router.register(r'erp/departments', DepartmentViewSet, basename='erp-department')
router.register(r'erp/staff', StaffMemberViewSet, basename='erp-staff')
router.register(r'erp/students', ERPStudentViewSet, basename='erp-student')
router.register(r'erp/enquiries', ERPEnquiryViewSet, basename='erp-enquiry')
router.register(r'erp/attendance', ERPAttendanceViewSet, basename='erp-attendance')
router.register(r'erp/staff-attendance', StaffAttendanceViewSet, basename='erp-staff-attendance')
router.register(r'erp/payments', FeePaymentViewSet, basename='erp-payment')
router.register(r'erp/belt-promotions', BeltPromotionViewSet, basename='erp-belt-promotion')

urlpatterns = [
    path('auth/login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),
    path('erp/dashboard-stats/', ERPDashboardStatsView.as_view(), name='dashboard_stats'),
    path('erp/punch/status/', PunchStatusView.as_view(), name='punch_status'),
    path('erp/punch/toggle/', PunchToggleView.as_view(), name='punch_toggle'),
    path('erp/punch/workforce/', WorkforceAttendanceView.as_view(), name='workforce_attendance'),
    path('', include(router.urls)),
]
