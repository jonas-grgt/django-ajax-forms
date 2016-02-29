import os

from django import template
from django.utils.safestring import mark_safe

import ajax_forms

register = template.Library()

VALIDATION_SCRIPT = None

def include_validation():
    global VALIDATION_SCRIPT
    if VALIDATION_SCRIPT is None:
        VALIDATION_SCRIPT = open(os.path.join(os.path.dirname(ajax_forms.__file__), 'media', 'ajax_forms', 'js', 'jquery-ajax-validation.js')).read()
    return mark_safe('<script type="text/javascript">%s</script>' % VALIDATION_SCRIPT)
register.simple_tag(include_validation)
