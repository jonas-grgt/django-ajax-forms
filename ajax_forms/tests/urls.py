from django.conf.urls.defaults import *
from views import ContactView

urlpatterns = patterns('',
        url(r'^contact/$', ContactView.as_view(), name='contact')
)

