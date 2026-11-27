from django.urls import path
from . import views

app_name = 'academy_panel'

urlpatterns = [
    path('login/', views.staff_login_view, name='login'),
    path('logout/', views.staff_logout_view, name='logout'),
    path('', views.overview_view, name='overview'),

    # Admissions & Enquiries Management
    path('applications/', views.application_list_view, name='applications'),
    path('applications/<int:pk>/', views.application_detail_view, name='application_detail'),
    path('enquiries/', views.general_enquiries_view, name='enquiries'),

    # Full Website Content Management
    path('content/', views.content_hub_view, name='content_hub'),
    path('content/courses/', views.manage_courses_view, name='manage_courses'),
    path('content/instructors/', views.manage_instructors_view, name='manage_instructors'),
    path('content/timetable/', views.manage_timetable_view, name='manage_timetable'),
    path('content/gallery/', views.manage_gallery_view, name='manage_gallery'),
    path('content/achievements/', views.manage_achievements_view, name='manage_achievements'),
    path('content/academy-info/', views.manage_academy_info_view, name='manage_info'),
    path('content/appearance/', views.manage_appearance_view, name='manage_appearance'),

    # Admin Password Settings
    path('account/', views.account_settings_view, name='account_settings'),
]
