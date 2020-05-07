$(function(){
  const path = window.location.pathname;
  const groupId = $(".chat__header__left-header__title").attr("id");
  function buildHTML(message){
    var image = "";
    if(message.image){
      var image = `<img class="lower-message__image" src="${message.image}"></img>`;
    }
   const html = `
                <div class="messages__message" data-message-id= ${message.id}>
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
      const html = buildHTML(message);
      $(".messages").append(html);
      $('.messages').animate({
        scrollTop: $('.messages')[0].scrollHeight
      }, 10);
    })
    .fail(function(){
      alert("メッセージ送信に失敗しました");
    })
    .always(function(){
      $('.chat__form__submit').prop('disabled', false);
      $("#new_message")[0].reset();
    })
  });

  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    var last_message_id = $('.messages__message:last').data("message-id");
    console.log(last_message_id)
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      //追加するHTMLの入れ物を作る
      if (messages.length !== 0) {
      var insertHTML = '';
      //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
      $.each(messages, function(i, message) {
        insertHTML += buildHTML(message)
      });
      //メッセージが入ったHTMLに、入れ物ごと追加
      $('.messages').append(insertHTML);
      $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  if (path == `/groups/${groupId}/messages`){
  setInterval(reloadMessages, 7000);
  };
});
