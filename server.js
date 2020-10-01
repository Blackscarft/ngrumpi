const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//setting static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName  = 'Admin Ganteng';


// dijalankan ketika pengguna terkoneksi
io.on('connection', socket => {
    socket.on('joinRoom',({username, room})=> {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room)

        //pesan ke satu pengguna
        socket.emit('message',formatMessage(botName,'Selamat datang di WallChat'));
    
        //pesan ke semua ketika ada pengguna yang masuk kecuali pengguna itu sendiri
        socket.broadcast.to(user.room).emit('message',formatMessage(botName, `${user.username} bergabung ke dalam grub`));

        //mengedit users dan info di sidebar
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        });
        
    });

    // mengambil pesan dari client
    socket.on('chatMessage',msg=>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })

    //dijalankan ketika ada yang keluar
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName, `${user.username} keluar dari grub`));
        };

        //mengedit users dan info di sidebar
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        });
    });

    //pesan ke semua orang
    //io.emit();

    
});


const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=> console.log(`Server berjalan di port ${PORT}`));