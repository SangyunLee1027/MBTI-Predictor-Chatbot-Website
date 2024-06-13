from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed

from rest_framework.views import APIView
from .models import User

import jwt, datetime


# Create your views here.

# class RegisterView(APIView):
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

@api_view(['POST'])
def register_User(request):
    serializer = UserSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def signin_User(request):
    email = request.data['email']
    password = request.data['password']

    user_query = User.objects.raw('SELECT * FROM auths_User WHERE email = %s', [email])
    user = next(iter(user_query), None)

    if user is None:
        raise AuthenticationFailed('User not found!')

    if not user.check_password(password):
        raise AuthenticationFailed('Incorrect password')


    access_payload = {
        'id' : user.id,
        'email' : user.email,
        'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(seconds=10),
        'iat': datetime.datetime.now(datetime.UTC)
    }

    refresh_payload = {
        'id' : user.id,
        'email' : user.email,
        'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=1),
        'iat': datetime.datetime.now(datetime.UTC)
    }

    accessToken = jwt.encode(access_payload, 'secret12323123dfs', algorithm='HS256')

    refreshToken = jwt.encode(refresh_payload, 'secret2dfaxcasczxcaszc', algorithm='HS256')

    response = Response()

    response.set_cookie(key='jwt', value=refreshToken, httponly=True, samesite = 'None', secure=True, expires=refresh_payload["exp"]) 
    
    # response.set_cookie(key='jwt', value=refreshToken, httponly=True, samesite = 'None', secure=True, max_age = 36000) 

    response.data = {"name": user.name, "accessToken": accessToken}

    return response


class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        
        print(request.COOKIES)

        if not token:
            raise AuthenticationFailed("Unauthenticated!1")
        
        try:
            payload = jwt.decode(token, 'secret2dfaxcasczxcaszc', algorithms='HS256')

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated!2")
        
        user_query = User.objects.raw('SELECT * FROM auths_User WHERE id = %s', [payload['id']])
        user = next(iter(user_query), None)

        # serializer = UserSerializer(user)

        access_payload = {
        'email' : user.email,
        'id' : user.id,
        'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(seconds=10),
        'iat': datetime.datetime.now(datetime.UTC)
    }

        accessToken = jwt.encode(access_payload, 'secret', algorithm='HS256')

        response = Response()

        response.data = {"email" : user.email, "name": user.name, "accessToken": accessToken}

        return response

@api_view(['POST'])
def signout_User(request):

    response = Response()
    # response.delete_cookie(key='jwt', samesite = 'None')
    response.set_cookie(key='jwt', value='', path='/', httponly=True, samesite = 'None', secure=True, expires = datetime.datetime.now(datetime.UTC)) 
    response.data ={
        'message': "success"
    }
    
    return response
