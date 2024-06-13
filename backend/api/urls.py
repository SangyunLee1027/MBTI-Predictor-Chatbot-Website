from django.urls import path
from .views import predict, chatting, getRoutes, load_chats

urlpatterns = [
    path('', getRoutes),
    path('predict', predict, name='predict'),
    path('load_chats', load_chats, name='load_chats'),
    path('chatting', chatting, name = 'chatting')

    # path('chatting/', chatting, name = 'chatting')

]
