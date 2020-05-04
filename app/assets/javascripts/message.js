$(function(){
  function buildHtml(message){
    var image = "";
    if(message.image){
      var image = `<img class="lower-message__image" src="${message.image}"></img>`;
    }
   const html = `
                <div class="messages__message">
                  <div class="messages__message__upper-message">
                    <div class="messages__message__upper-message__user-name">
                      ${message.user_name}
                    </div>
                  <div class="messages__message__upper-message__date">
                    ${message.created_at}
                  </div>
                 </div>
                 <div class="messages__message__lower-meesage">
                  ${message.content}
                 </div>
                </div>
                ${image}
                  `
    return html;

  }
  $("#new_message").on("submit", function(e){
    e.preventDefault();
    const url = $(this).attr("action")
    const formData =  new FormData(this);
    console.log(formData);
    $.ajax({
      url: url,  //同期通信でいう『パス』
      type: 'POST',  //同期通信でいう『HTTPメソッド』
      data: formData,  
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message){
      const html = buildHtml(message);
      $(".messages").append(html);
      $('.messages').animate({
        scrollTop: $('.messages')[0].scrollHeight
      }, 10);
      $("#new_message")[0].reset();
    })
    .fail(function(){
      alert("メッセージ送信に失敗しました");
    })
    .always(function(){
      $('.chat__form__submit').prop('disabled', false);
    })


  
  });

  
});
