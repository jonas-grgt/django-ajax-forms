=====
Usage
=====

To use django-ajax-form-mixin, it requires you add a the AjaxFormMixin to your FromView, and some javascript to any page with the form.

For example, if you had the following form::

    from django import forms

    class ContactForm(forms.Form):
        name = forms.CharField(label='Your Name')
        email = forms.EmailField(label='Your Email')
        message = forms.CharField(label='Your Message', widget=forms.Textarea)

With the following View::

    class ContactFormView(FormView, AjaxValidatingFormMixin):
        template_name = "contact-form.html"
        form_class = ContactForm

And the following urls configuration::

    url(r'^contact/$', ContactFormView.as_view(), name="contact_form"),

And then in the template in which you are displaying the form, you should add::

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
    {% load jquery_validation %}
    {% include_validation %}
    <script type="text/javascript">
        $(function()    {
            $('#form')
                .validate('{% url contact_form %}', 
                          { 
                              type: 'ul', 
                              fields: ['id_email'], 
                              event: 'focusout'
                              successCallback: function(field) {
                                  if(field.next("span").length == 0) {
                                      field.after("<span class=\"ico-ok\">ok</span>");
                                  }
                              }
                          });

        });
    </script>

As you can see, you need to have jQuery for this to work(here it is being loaded
from google). 

.. js:function:: $.validate(url, options)
    
    :param string url: The url to post to
    :param dictionary options: Dictionary of extra options 

    *options*

    * `type` can either be ul, p or table. If no type is defined it defaults to ul.
    * `fields` can be true if all fields need immediate ajax validation response or a list of fields that will need an immediate ajax response.  In the example above only the email field will show imediate validation errors when focusing out of the field.
    * `event` can by any valid jQuery event which is executed on each field (this depends ofcourse on how you've set the fields property).
    * `fieldSuccessCallback(field)` is a callback function that is triggered when the field is valid. It takes one parameter the field that has been validated successfully.  In the the example it adds an icon after the field. This can be used to add some extra information to the form that the field has been valid. For example add a green border around the field or a message saying the e-mail address is still available. Takes the field that has been marked as invalid as the only parameter.
    * `formSuccessCallback` is a callback function that is triggered when the form is valid, after it has been submited. This callback should be implemented to for example redirect to user to a success page or just remove the form and show a message that the form has been submited successfully.
    * `fieldInvalidCallback(field)` is a callback function that is triggered when a field is invalid. You could use this to remove style/elements you've added if the field has been marked as valid before. In other words if the fieldSuccessCallback function has been called on the field, before, and added some extra markup/style, that should be removed now. Takes the field that has been marked as invalid as only parameter.

The AjaxValidatingFormMixin only overwrites the post handler. 
So a normal GET request will serve the renderd form as defined in contact-form.html, as usual.
POST request will validate the form and return a JSON response dictionary. 
The response will be handled by the jQuery plugin.
