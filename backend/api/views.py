from django.shortcuts import render
from rest_framework.decorators import api_view
from .apps import ApiConfig
from rest_framework.response import Response
from .models import Messages
import torch
from django.apps import apps
from rest_framework.exceptions import AuthenticationFailed
from transformers import Conversation


from auths.models import User

import jwt, datetime



# Create your views here.

@api_view(['GET'])
def getRoutes(request):
    routes = [
        'GET/api',
        'GET /api/predict',
        'POST /api/chatting',
        'GET /api/load_chats'

    ]

    return Response(routes)


@api_view(['GET'])
def load_chats(request):
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
    user_id = user.email

    messages_query = Messages.objects.raw('SELECT * FROM api_Messages WHERE user = %s', [user_id])

    history = [msg.json_body for msg in messages_query]

    return Response(history)


@api_view(['POST'])
def chatting(request):

    token = request.COOKIES.get('jwt')
        
    if not token:
        raise AuthenticationFailed("Unauthenticated!1")
    
    try:
        payload = jwt.decode(token, 'secret2dfaxcasczxcaszc', algorithms='HS256')

    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!2")
    
    user_query = User.objects.raw('SELECT * FROM auths_User WHERE id = %s', [payload['id']])
    user = next(iter(user_query), None)
    user_id = user.email

    api_config = apps.get_app_config('api')
    chat_model = api_config.chat_model


    new_chat = request.data.get('message')
    messages_query = Messages.objects.raw('SELECT * FROM api_Messages WHERE user = %s', [user_id])

    history = [msg.json_body for msg in messages_query]

    new_user_input = {"role": "user", "content" : new_chat}

    new_user_message = Messages(user = user_id, body = new_chat, type = 'user', json_body = new_user_input)
    new_user_message.save()

    history.append(new_user_input)

    def create_conversation_with_prepend(history):
        concatenated_text = ""
        sep_token = api_config.chat_tokenizer.sep_token
        for message in history:
            concatenated_text += f"{message['role']}: {message['content']} {sep_token}"

        return concatenated_text
    
    cur_history = None
    i = 0
    while True:
        i += 1
        new_conversation = create_conversation_with_prepend(history[-i:])
        if len(api_config.chat_tokenizer(new_conversation)["input_ids"]) < 128:
            cur_history = history[-i:]
            continue
        else:
            if i == 1:
                return Response({'chat' : "Your text is too long. Make it shorter."})
            break
    

    new_bot_message = chat_model(cur_history)[-1]["content"]

    print(new_bot_message)
    
    new_bot_message_to_save = Messages(user = user_id, body = new_bot_message, type = 'assistant', json_body = {"role": "assistant", "content" : new_bot_message})
    new_bot_message_to_save.save()

    return Response({'chat' : new_bot_message})

# @api_view(['GET'])
# def chatting(request):

#     token = request.COOKIES.get('jwt')

#     api_config = apps.get_app_config('api')
#     chat_model = api_config.chat_model

#     new_chat = request.data['msg']
#     messages_query = Messages.objects.raw('SELECT * FROM api_Messages WHERE user = %s', [user_id])

#     history = [msg.json_body for msg in messages_query]

#     new_user_input = {"role": "user", "content" : new_chat}

#     new_user_message = Messages(user = user_id, body = new_chat, type = 'user', json_body = new_user_input)
#     new_user_message.save()

#     history.append(new_user_input)
#     new_bot_message = chat_model(history)[-1]["content"]
    
#     new_user_message = Messages(user = user_id, body = new_chat, type = 'assistant', json_body = {"role": "assistant", "content" : new_bot_message})
#     new_user_message.save()

#     return Response({'chat' : new_bot_message})



@api_view(['GET'])
def predict(request):
    
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
    user_id = user.email

    messages_query = Messages.objects.raw('SELECT * FROM api_Messages WHERE user = %s AND type = %s', [user_id, 'user'])

    history = [msg.body for msg in messages_query]

    api_config = apps.get_app_config('api')

    tokened_input = api_config.tokenizer(". ".join(history), max_length = 512, padding='max_length', truncation=True)
    tokened_input = {key: torch.tensor(value).to(api_config.device) for key, value in tokened_input.items()}
    outputs = api_config.classify_model(**tokened_input)

    labeled = torch.round(torch.sigmoid(outputs["logits"]))
    output_label = api_config.IElabel[int(labeled[0][0])] + api_config.NSlabel[int(labeled[0][1])] + api_config.FTlabel[int(labeled[0][2])] + api_config.JPlabel[int(labeled[0][3])]
    
    return Response({'prediction' : f"Your MBTI must be {output_label}!"})
