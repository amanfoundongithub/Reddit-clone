import React, { useState ,useEffect} from "react"
import axios from "axios"

const ChatComponent = (props)=>{

    const socket = props.socket 

    const username = props.username 

    const room = props.room 

    axios.post('http://localhost:4000/userdata/preparechat',{
        room: room,
    }).then((res)=>{
        sendRes(res.data.chats) 
    })

    const [message,setMessage] = useState('')

    const SendMessage = async ()=>{
        if(message.length === 0)
        {
            alert('MADARCHOD')
            return 
        }

        const messageData = {
            room: room, 
            author: username, 
            message: message, 
            time: new Date().getHours() + ":" + new Date().getMinutes(),
        }

        await socket.emit('send_message',messageData) 

        sendRes(()=>[...res,messageData]) 

        setMessage('') 
    }

    const [res,sendRes] = useState([]) 


        console.log("res before useEffect: ",res) 
        socket.on('get_message',(data)=>{
            sendRes(()=>[...res,data]) 
        })
   

    return(
        <div>
            <div>
                {
                    res.length === 0 ?
                    ""
                    :
                    res.map((e,index)=>{
                        return(
                            <p key={index}>{e.message}</p>
                        )
                    })
                }
                
            </div>
            <div>
                <input value={message} onChange={(e)=>setMessage(e.target.value)} />
                <button onClick={SendMessage}>Send</button>
            </div>
        </div>
    )

}

export default ChatComponent