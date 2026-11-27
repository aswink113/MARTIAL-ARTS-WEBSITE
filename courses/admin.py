from django.contrib import admin
from .models import AgeCategory, Instructor, Course


@admin.register(AgeCategory)
class AgeCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'min_age', 'max_age', 'sort_order', 'is_active')
    list_filter = ('is_active',)


@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'disciplines', 'rank_grade', 'is_head_coach', 'is_active')
    list_filter = ('is_head_coach', 'is_active')
    search_fields = ('name', 'disciplines')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'discipline', 'age_group', 'level', 'fee', 'currency', 'is_featured', 'is_active')
    list_filter = ('discipline', 'level', 'is_featured', 'is_active')
    search_fields = ('name', 'summary')
    prepopulated_fields = {'slug': ('name',)}
