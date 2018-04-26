(function($) {
  var form = $('#frm-send-message')
    , recipient = form.find('#frm-recipient')
    , message = form.find('#frm-message')
    , url = '/send'
    , codeBlock = $('#code-block');

  codeBlock.hide();

  form.submit(function(event) {
    event.preventDefault();
    codeBlock.hide();

    var data = {
      recipients: [recipient.val()],
      message: message.val()
    };

    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(res) {
        codeBlock.text(JSON.stringify(res));
        codeBlock.show();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        codeBlock.text(JSON.stringify(errorThrown));
        codeBlock.show();
      }
    });
  });
})(jQuery);
