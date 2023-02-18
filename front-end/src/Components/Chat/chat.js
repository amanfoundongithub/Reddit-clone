import React, { useState ,useEffect} from "react"

const ChatComponent = (props)=>{

    const socket = props.socket 

    const username = props.username 

    const room = props.room 

    const [message,setMessage] = useState('')


    const SendMessage = async ()=>{
        if(message.length === 0)
        {

        }

        const messageData = {
            room: room, 
            author: username, 
            message: message, 
            time: new Date().getHours() + ":" + new Date().getMinutes(),
        }
        
        await socket.emit('send_message',messageData) 
        sendRes([...res,messageData]) 
        setMessage('') 
    }

    const [res,sendRes] = useState([]) 
    useEffect(()=>{
        socket.on('get_message',(data)=>{
            console.log("Bruh")
            console.log(data) 
            sendRes([...res,data]) 
        })
    },[socket])

    return(
        <div>
            <div>
                Chat Header
            </div>
            <div>
                {
                    res.length === 0 ?
                    ""
                    :
                    res.map((e)=>{
                        return(
                            <p>{e.message}</p>
                        )
                    })
                }
            </div>
            <div>
                Chat Footer
                <input value={message} onChange={(e)=>setMessage(e.target.value)} />
                <button onClick={SendMessage}>Send </button>
            </div>
        </div>
    )

}

export default ChatComponent