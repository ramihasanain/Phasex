"""
URL configuration for mt5_backend project.
"""
from django.urls import path, include

urlpatterns = [
    path('api/mt5/', include('mt5_api.urls')),
]
