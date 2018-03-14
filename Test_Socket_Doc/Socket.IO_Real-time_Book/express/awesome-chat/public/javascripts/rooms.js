let chatInfra = io.connect('/chat_infra');

// Join_room doesn't happen here. All are done in chat.js

chatInfra.on('connect', () => {
  // Send a request to get a list of currently used rooms
  console.log('chat infra is ', chatInfra)
  chatInfra.emit('get_rooms', {});
  // chatInfra.on('socket_send', (data) => console.log('socket_send is', data))
  // Receive a list of currently used rooms
  chatInfra.on('rooms_list', function (rooms){
    // For each room, display it and the button to join the room
    for (let room in rooms) {
      let roomDiv = `<div class="room_div"><span class="room_name">${room}</span>
                    <span class="room_users">[ ${rooms[room]} Users ]</span>
                    <a class="room" href="/chatroom?room=${room}">Join</a></div>`;
      $('#rooms_list').append(roomDiv);
    }
  });
});

$(function() {
  $('#new_room_btn').click(() => {
    window.location = '/chatroom?room=' + $('#new_room_name').val();
  });
});