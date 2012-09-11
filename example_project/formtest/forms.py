from django import forms

from formtest.models import Contact

class ContactForm(forms.Form):
    name = forms.CharField()
    email = forms.EmailField()
    age = forms.IntegerField()

class ContactModelForm(forms.ModelForm):
    class Meta:
        model = Contact
