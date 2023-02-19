import React, { useState } from "react"
import io from 'socket.io-client'
import ChatComponent from "../Components/Chat/chat"
import axios from "axios"

// Connect to the Socket.io server 
const socket = io.connect('http://localhost:4001') 

const MessagePage = (props)=>{

    axios.post('http://localhost:4000/userdata/chatroom',{
        to: props.to,
        from: props.from,
    }).then((res)=>{
        // console.log("ID Of the chatroom: ",res.data.id)
        sroom(res.data.id) 
    }).catch((err)=>{
        console.log("AXIOS ERROR") 
    })

    const [room,setRoom] = useState('')

    const sroom = (room)=>{
        setRoom(room) 
        socket.emit("join_room",room) 
    }

    return(
        <div>
            {
                room.length === 0 ?
                ""
                :
                <ChatComponent socket={socket} username={props.from} room={room}/>
            }
        </div>
    )
}

export default MessagePage