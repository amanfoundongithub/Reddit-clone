import React, { useState } from "react"
import axios from "axios"
import '../../App.css'
import SendIcon from '@mui/icons-material/Send';

const getDate = (date)=>{
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date(date);
    return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}

const getTime = (date)=>{
    let d = new Date(date) 
    return d.toTimeString().split(' ')[0]
}

const ChatComponent = (props)=>{

    const socket = props.socket 

    const username = props.username 

    const room = props.room 

    const images = props.images 

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
            time: new Date(),
            date: new Date(),
        }

        await socket.emit('send_message',messageData) 

        sendRes(()=>[...res,messageData]) 

        setMessage('') 
    }

    const [res,sendRes] = useState([]) 

    socket.on('get_message',(data)=>{
        sendRes(()=>[...res,data]) 
    })

    let chatdesc = {
        fontSize:'20px',
    }

    let timedesc ={
        fontSize:'10px',
    }
    return(
        <div>
            <div>
                {
                    res.length === 0 ?
                    ""
                    :
                    res.map((e,index)=>{
                        if(e.author === username)
                        {
                            return(
                                <div class="chat-message-right pb-4">
								<div>
									<img src={images[1]} class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40" />
									<div class="text-muted small text-nowrap mt-2"
                                    style = {timedesc}>{getTime(e.date)}</div>
								</div>
								<div class="flex-shrink-1 bg-info rounded py-2 px-3 mr-3" style={chatdesc}>
									<div class="font-weight-bold mb-1" style={{
                                        fontWeight:'bold',
                                        fontSize:'15px',
                                    }}>{e.author} on {getDate(e.date)}</div>
									{e.message}
								</div>
							</div>
                            )
                        }
                        else 
                        {
                            return(
                                <div class="chat-message-left pb-4">
								<div>
									<img src={images[0]} class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40"/>
									<div class="text-muted small text-nowrap mt-2"
                                    style = {timedesc}>{getTime(e.date)}</div>
								</div>
								<div class="flex-shrink-1 bg-warning rounded py-2 px-3 ml-3"  style={chatdesc}>
									<div class="font-weight-bold mb-1" style={{
                                        fontWeight:'bold',
                                        fontSize:'15px',
                                    }}>{e.author} on {getDate(e.date)}</div>
									{e.message}
								</div>
							</div>
                            )
                        }
                    })
                }
                
            </div>
            <div>
            <div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Enter your message here..." aria-label="Recipient's username" aria-describedby="basic-addon2" value={message} onChange={(e)=>setMessage(e.target.value)}/>
  <button onClick={SendMessage} className="btn btn-outline-success"><SendIcon /></button>
</div>
            </div>
        </div>
    )

}

export default ChatComponent