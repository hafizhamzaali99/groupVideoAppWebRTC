require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const dbConnect = require('./config')
const Room = require('./roomModel')

const users = {};

const socketToRoom = {};

//connecting to database
dbConnect()

// let roomId = []

io.on('connection', socket => {
    socket.on("join room", roomID => {
        // roomId.push(roomID)
        // console.log(roomID)
        if (users[roomID]) {
            const length = users[roomID].length;
            // console.log(length)
            if (length === 5) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        // console.log(users[roomID])

        onConnect(roomID,users)
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
        // console.log(usersInThisRoom)
        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        console.log("disConnect",roomID)
        let room = users[roomID];
        console.log("disConnect",room)
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
        onDisconnect(roomID,room)
    });

});

const onConnect = async (roomID,users)=>{
    const roomId = roomID
    const person = users[roomID]
    const existRoom = await Room.findOne({roomId})
    if(!existRoom){
        const room = await Room.create({roomId,person})
        console.log("new",room)
    }else{
        existRoom.person = person 
        existRoom.save()
    }

}
const onDisconnect = async (roomID,room)=>{
    const roomId = roomID
    const person = room
    const existRoom = await Room.findOne({roomId})
    existRoom.person = person
    existRoom.save()
}

server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));


