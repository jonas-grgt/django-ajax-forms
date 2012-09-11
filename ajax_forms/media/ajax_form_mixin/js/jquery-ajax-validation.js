(function($) {
    function inputs(form)   {
        return form.find(":input:visible:not(:button)");
    }
    $.fn.validate = function(url, settings) {
        settings = $.extend({
            type: 'ul',
            callback: false,
            // List of fields that should be validated on a per field basis or True for all fields. 
            // Only those fields listed will be validated upon the given event.
            // If no form fields are listed or fields is false validation will only happen on submit.
            fields: false,
            event: 'submit',
            submitHandler: null,
            fieldSuccessCallback: null,
            formSuccessCallback: null,
            fieldInvalidCallback: null,
            callback: null
        }, settings);

        function ajaxForm(form, data, field, formSuccessCallback) {
            var field = field || false;
            var formSuccessCallback = formSuccessCallback || false;
            $.ajax({
                async: false,
                data: data,
                dataType: 'json',
                traditional: true,
                error: function(XHR, textStatus, errorThrown)   {
                    status = true;
                },
                success: function(data, textStatus) {
                    status = data.valid;
                    if (data.valid) {     
                        if(settings.fieldSuccessCallback) {
                            settings.fieldSuccessCallback($('#' + field));
                        }
                        $(form).find('ul.errorlist').remove();
                        if(formSuccessCallback) {
                            formSuccessCallback();
                        }
                    } else {
                        if (settings.callback)  {
                            settings.callback($(form), data);
                        }
                        else    {
                            var get_form_error_position = function(key) {
                                key = key || '__all__';
                                if (key == '__all__') {
                                    var filter = ':first';
                                } else {
                                    var filter = ':first[id^=id_' + key.replace('__all__', '') + ']';
                                }
                                return inputs(form).filter(filter).parent();
                            };
                            if (settings.type == 'p')    {
                                if(!data.errors[field] && settings.fieldSuccessCallback) {
                                    $('#' + field).parent().prev('ul.errorlist').remove();
                                    settings.fieldSuccessCallback($('#' + field));
                                }
                                $.each(data.errors, function(key, val)  {
                                    if (key.indexOf('__all__') >= 0)   {
                                        var error = get_form_error_position(key);
                                        if (error.prev().is('ul.errorlist')) {
                                            error.prev().before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                        }
                                    }
                                    else {
                                        if(field) { 
                                            if(field == key && $('#' + field).val().length > 0) {
                                                if(settings.fieldInvalidCallback) {
                                                    settings.fieldInvalidCallback($('#' + field));
                                                }
                                                $('#' + field).parent().prev('ul.errorlist').remove();
                                                $('#' + key).parent().before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                            }
                                        } else {
                                            if(settings.fieldInvalidCallback) {
                                                settings.fieldInvalidCallback($('#' + field));
                                            }
                                            $('#' + field).parent().prev('ul.errorlist').remove();
                                            $('#' + key).parent().before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                        }
                                    }
                                });
                            }
                            if (settings.type == 'table')   {
                                if(!data.errors[field] && settings.fieldSuccessCallback) {
                                    $('#' + field).siblings("ul.errorlist").remove();
                                    settings.fieldSuccessCallback($('#' + field));
                                }
                                $.each(data.errors, function(key, val)  {
                                    if (key.indexOf('__all__') >= 0)   {
                                        get_form_error_position(key).parent().before('<tr><td colspan="2"><ul class="errorlist"><li>' + val + '.</li></ul></td></tr>');
                                    }
                                    else {
                                        if(field) {
                                            if(field == key && $('#' + field).val().length > 0) {
                                                if(settings.fieldInvalidCallback) {
                                                    settings.fieldInvalidCallback($('#' + field));
                                                }
                                                $('#' + field).siblings("ul.errorlist").remove();
                                                $('#' + key).before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                            }
                                        } else {
                                            if(settings.fieldInvalidCallback) {
                                                settings.fieldInvalidCallback($('#' + field));
                                            }
                                            $('#' + field).siblings("ul.errorlist").remove();
                                            $('#' + key).before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                        }
                                    }
                                });
                            }
                            if (settings.type == 'ul')  {
                                if(!data.errors[field] && settings.fieldSuccessCallback) {
                                    $('#' + field).siblings('ul.errorlist').remove();
                                    // Clear errors for this field if present
                                    setttings.fieldSuccessCallback($('#' + field));
                                }
                                $.each(data.errors, function(key, val)  {
                                    if (key.indexOf('__all__') >= 0)   {
                                        get_form_error_position(key).before('<li><ul class="errorlist"><li>' + val + '</li></ul></li>');
                                    }
                                    else {
                                        if(field) {
                                            if(field == key && $('#' + field).val().length > 0) {
                                                if(settings.fieldInvalidCallback) {
                                                    settings.fieldInvalidCallback($('#' + field));
                                                }
                                                $('#' + field).siblings('ul.errorlist').remove();
                                                $('#' + key).prev().before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                            }
                                        } else {
                                            if(settings.fieldInvalidCallback) {
                                                settings.fieldInvalidCallback($('#' + field));
                                            }
                                            $('#' + key).prev().before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                        }
                                    }
                                });
                            }
                        }
                    }
                },
                type: 'POST',
                url: url
            });
        }


        if(settings.event != 'submit') {
            if(Object.prototype.toString.call(settings.fields)  == '[object Array]') {
                var form = $(this);
                $(settings.fields).each(function(i,el) {
                    $('#' + el).each(function(index, el) {
                        $(el).on(settings.event, function(event) {
                            field = $(this).attr("id");
                            ajaxForm($(form), $(form).serialize(), field, null);
                        });
                    });
                });
            } else {
                var form = $(this);
                $('input, checkbox, select',this).not('input[type=submit]').each(function(index, el) {
                    $(el).on(settings.event, function(event) {
                        field = $(this).attr("id");
                        ajaxForm($(form), $(form).serialize(), field, null);
                    });
                });
            }
        } 

        $(this).on("submit", function(event) {
            event.preventDefault();
            $(this).find('ul.errorlist').remove();
            ajaxForm($(this), $(this).serialize()+"&submit=true", null, settings.formSuccessCallback);
        });
    };
})(jQuery);
