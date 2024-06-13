from django.urls import path, include
from .views import UserView
from . import views

urlpatterns = [
    path('register', views.register_User),
    path('signin', views.signin_User),
    path('signout', views.signout_User),
    path('user', UserView.as_view()),
]

