from django.urls import path
from .views.user import RegisterView, login_view, logout_view, profile_view, users_list_view

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', profile_view, name='profile'),
    path('users/', users_list_view, name='users-list'),  # (admin only)
]