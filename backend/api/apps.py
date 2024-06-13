from django.apps import AppConfig
import torch
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        self.chat_tokenizer = AutoTokenizer.from_pretrained("facebook/blenderbot-400M-distill", truncation=True, truncation_strategy='only_last')


        self.chat_model = pipeline(task = "conversational", tokenizer = self.chat_tokenizer, model = "facebook/blenderbot-400M-distill",  max_length = 1024)

        model_path = "./Trained_Model/my_fine_tuned_model"

        self.classify_model = AutoModelForSequenceClassification.from_pretrained(model_path)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.classify_model.to(self.device)

        self.tokenizer = AutoTokenizer.from_pretrained(model_path, truncation = True, truncation_strategy='only_last')

        self.IElabel = {0 : "I", 1 : "E"}

        self.NSlabel = {0 : "N", 1 : "S"}

        self.FTlabel = {0 : "F", 1 : "T"}

        self.JPlabel = {0 : "J", 1: "P"}

# def ready(self):
#         self.chat_tokenizer = AutoTokenizer.from_pretrained("facebook/blenderbot-400M-distill")
        
#         self.chat_tokenizer.model_max_length = 128

#         self.chat_model = pipeline(task = "conversational", tokenizer = self.chat_tokenizer, model = "facebook/blenderbot-400M-distill")

#         model_path = "./Trained_Model/my_fine_tuned_model"

#         self.classify_model = AutoModelForSequenceClassification.from_pretrained(model_path)
#         self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
#         self.classify_model.to(self.device)

#         self.tokenizer = AutoTokenizer.from_pretrained(model_path, truncation = True, truncation_strategy='only_last')
        

#         self.IElabel = {0 : "I", 1 : "E"}

#         self.NSlabel = {0 : "N", 1 : "S"}

#         self.FTlabel = {0 : "F", 1 : "T"}

#         self.JPlabel = {0 : "J", 1: "P"}

