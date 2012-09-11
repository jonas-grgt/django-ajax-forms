from django.conf.urls import patterns, url

from formtest.views import ContactFormView
from formtest.views import ContactCreateView

urlpatterns = patterns('',
    url(r'^contact/$', ContactFormView.as_view(), name="contact_form"),
    url(r'^contactmodel/$', ContactCreateView.as_view(), name="contact_model_form"),
)
