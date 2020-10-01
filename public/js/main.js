const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// mendapatkan username dan room dari url
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

const socket = io();

//bergabung ke grub dikirim ke server
socket.emit('joinRoom',{username, room});

// mendapatkan room dan username dari server
socket.on('roomUsers',({room,users}) => {
    outputRoomName(room);
    outputRoomUsers(users);
});

// pesan dari server
socket.on('message', message=>{
    console.log(message);
    outputMessage(message);

    // Scroll kebawah ketika pesan masuk
    chatMessage.scrollTop = chatMessage.scrollHeight;
})

// pesan di kirim
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    // mendapatkan text pesan dari form id msg
    const pesan = e.target.elements.msg.value;

    // mengirim pesan ke server
    socket.emit('chatMessage',pesan);

    //clear kotak text untuk mengirim pesan
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// mengeluarkan pesan ke tampilan
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


// mengeluarkan tampilan room name
function outputRoomName(room){
    roomName.innerHTML = room;
}

// mengeluarkan tampilan room users

function outputRoomUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}