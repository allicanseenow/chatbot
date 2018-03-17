$(function() {
  $('#startchat').click(() => {
    // Set a new cookie named "nickname" with a new value being the username
    document.cookie = `nickname=${$('#nickname').val()}; value=true; path=/`;
    window.location = '/rooms';
  });
});