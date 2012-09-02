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
            successCallback: null,
        }, settings);

        function ajaxForm(form, data, field, successCallback) {
            var field = field || false;
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
                    if (!data.valid)    {
                        if (settings.callback)  {
                            settings.callback(data, form);
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
                                form.find('ul.errorlist').remove();
                                if(!data.errors[field] && successCallback) {
                                    successCallback($('#' + field));
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
                                                $('#' + key).prev().before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                            }
                                        } else {
                                            $('#' + key).parent().before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                        }
                                    }
                                });
                            }
                            if (settings.type == 'table')   {
                                inputs(form).prev('ul.errorlist').remove();
                                form.find('tr:has(ul.errorlist)').remove();
                                if(!data.errors[field] && successCallback) {
                                    successCallback($('#' + field));
                                }
                                $.each(data.errors, function(key, val)  {
                                    if (key.indexOf('__all__') >= 0)   {
                                        get_form_error_position(key).parent().before('<tr><td colspan="2"><ul class="errorlist"><li>' + val + '.</li></ul></td></tr>');
                                    }
                                    else {
                                        if(field) {
                                            if(field == key && $('#' + field).val().length > 0) {
                                                $('#' + key).before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                            }
                                        } else {
                                            $('#' + key).before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                        }
                                    }
                                });
                            }
                            if (settings.type == 'ul')  {
                                inputs(form).prev().prev('ul.errorlist').remove();
                                form.find('li:has(ul.errorlist)').remove();
                                if(!data.errors[field] && successCallback) {
                                    successCallback($('#' + field));
                                }
                                $.each(data.errors, function(key, val)  {
                                    if (key.indexOf('__all__') >= 0)   {
                                        get_form_error_position(key).before('<li><ul class="errorlist"><li>' + val + '</li></ul></li>');
                                    }
                                    else {
                                        if(field) {
                                            if(field == key && $('#' + field).val().length > 0) {
                                                $('#' + key).prev().before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                            }
                                        } else {
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
                            ajaxForm($(form), $(form).serialize(), field, settings.successCallback);
                        });
                    });
                });
            } else {
                var form = $(this);
                $('input, checkbox, select',this).each(function(index, el) {
                    $(el).on(settings.event, function(event) {
                        field = $(this).attr("id");
                        ajaxForm($(form), $(form).serialize(), field, settings.successCallback);
                    });
                });
            }
        } 

        $(this).on("submit", function(event) {
            event.preventDefault();
            ajaxForm($(this), $(this).serialize(), null, settings.successCallback);
        });
    };
})(jQuery);
