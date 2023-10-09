// import {createServer } from "http";
// import {Server} from "socket.io;"
// import { v4 as uuidv4 } from "uuid";
const  {createServer} = require("http");
const {Server} = require("socket.io");
const  { v4 : uuidv4 } = require("uuid");

const httpServer = createServer();
const io = new Server(httpServer,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    
    }
});
io.use((socket,next) => {
        const username = socket.handshake.auth.username;
        if(!username){
                next(new Error("Invalid username!"));
        }
        socket.username = username;
        socket.userId = uuidv4();
        next();
        
})

io.on("connection" , async(socket) => {
        const users = [];
        for(let [ id , socket ] of io.of("/").sockets){
                users.push({
                        userId: id,
                        username: socket.username,
                })

        }
        socket.emit("users",users);

        socket.emit("session", { userId:socket.userId , username:socket.username })
});
console.log("listening to port....")
httpServer.listen(process.env.PORT ||  4000)
