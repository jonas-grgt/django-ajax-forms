from django.core.urlresolvers import reverse
from django.test import TestCase

from forms import ContactForm

class AjaxFormViewTest(TestCase):
    urls = 'ajax_forms.tests.urls'

    def test_basic_initial(self):
        response = self.client.get(reverse('contact'))

        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.context['form'],
                            ContactForm))

    def test_valid_form_submit(self):
        """
        Test a valid form submit
        """

        valid_data = {
                    'name': 'Jesus',
                }

        response = self.client.post(reverse('contact'), valid_data)

        self.assertEqual(response.status_code, 200)

    


