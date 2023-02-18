import React, { useState } from "react"
import { useSearchParams } from "react-router-dom"
import io from 'socket.io-client'
import ChatComponent from "../Components/Chat/chat"

// Connect to the Socket.io server 
const socket = io.connect('http://localhost:4001') 

const MessagePage = ()=>{

    const [username,setUsername] = useState('') 
    const [room,setRoom] = useState('') 

    const joinRoom = ()=>{
        if(username.length === 0 )
        {

        }

        socket.emit("join_room",room)
    }



    return(
        <div>
            <h1>Chat</h1> 
            <input type='text' value={username} onChange={(e)=>setUsername(e.target.value)} />
            <input type='text' value={room} onChange={(e)=>setRoom(e.target.value)} />
            <br></br>
            <button onClick={joinRoom}>TJoin</button>

            <ChatComponent socket={socket} username={username} room={room}/>
        </div>
    )
}

export default MessagePage