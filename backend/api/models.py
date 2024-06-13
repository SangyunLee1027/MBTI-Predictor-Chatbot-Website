from django.db import models

# Create your models here.
class Messages(models.Model):
    user = models.CharField(max_length=200) # email of the user
    body = models.TextField()
    type = models.CharField(max_length=10) # either user or bot
    json_body = models.JSONField() # save form as dictionary for chat in the future


    created = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']

