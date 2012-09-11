from django.views.generic.edit import FormView
from django.views.generic.edit import BaseCreateView
from django.views.generic.edit import ModelFormMixin

from formtest.forms import ContactForm
from formtest.forms import ContactModelForm
from formtest.models import Contact
from ajax_forms.views import AjaxModelFormView
from ajax_forms.views import AjaxFormView

class ContactFormView(AjaxFormView):
    template_name = "contact-form.html"
    form_class = ContactForm

class ContactCreateView(AjaxModelFormView):
    template_name = "contact-model-form.html"
    form_class = ContactModelForm
    model = Contact
