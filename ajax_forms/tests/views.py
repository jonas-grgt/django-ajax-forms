from ajax_forms.views import AjaxFormView
from forms import ContactForm

class ContactView(AjaxFormView):
    template_name = "contact.html"
    form_class = ContactForm
