import axios from "axios";
import React, {useState } from "react"
import upvote from '../Images/upvote.png' 
import downvote from '../Images/downvote.png'
import comment from '../Images/comment.png'
import bookmarkicon from '../Images/bookmark.png' 
import report from '../Images/report.png'

const getDate = (date)=>{
    
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var now = new Date(date);
  return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}




const Post = (props)=>{

     const data = props.data 

     let sub = null 
     if(props.sub != undefined)
     {
        sub = props.sub 
     }
 

     const email = props.current

     const bookmark = props.arr 

     const mods = props.mod
     console.log("data:",data) 

     const [arr,setArr] = useState([]) 


     // Update the array

     const Update = async (e)=>{
      if(arr.length > 0 || e.length === 0)
      {
        return 
      }
      setArr(e) 
      
    }


        
       axios.post('http://localhost:4000/post/getcomment',{
      list: data.comments,
    }).then((res)=>{
      Update(res.data.output).then(()=>{
        console.log("SUCCESSS")
  
      }).catch((ERR)=>{
        console.log("Error: ",ERR)
      })
  
    })

    let dink = data.id 

      if(props.tim === false)
      {
        console.log("here")
        dink = data._id
      }
     // Creates a modal component to display the comments
     const ModalOfComments = ()=>{

      const [bodyofcomment,setBody] = useState('')
      

      const HandleComment = ()=>{
        axios.post('http://localhost:4000/post/comment',{
          email:email, 
          body:bodyofcomment,
          id:data.id, 
          
        }).then(()=>{
          console.log("DONE")
         
        }).catch((err)=>{
          console.log("Error: AXIOS") 
        })
      }
    


      
      return(
        <div style={{
          display:'inline-block'
        }}>
      
<button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target={ "#exampleModalinside" + data.id}>
<img src={comment} width='20' height='20' alt='op'/> &nbsp;
{data.comments.length}
</button>


<div class="modal fade" id={ "exampleModalinside" + data.id} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Comments</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        {
          data.comments.length === 0 ? 
          <p>NO comments yet!</p>
          :
          data.comments.map((val,index)=>{
            if(arr.length === 0)
            {
              return(
                <></>
              )
              
            }
            return(
              <div className="container my-3">
                <img src={arr[index].profile} height='30' width='30' className="rounded-circle" alt='profile'/>
                <a href={'/profile/' + arr[index].username } style={{
                  textDecoration:'none',
                  color:'black',
                  fontWeight:'bold'
                }}>{arr[index].username} &nbsp;</a>
                <p>{val.body}</p>
                
                </div>
            )
          })
        }

        <form onSubmit={HandleComment}>
        <div class="input-group mb-3">
  {/* <span class="input-group-text" id="basic-addon1">Comment :</span> */}
  <input type="text" class="form-control" placeholder="Add comment here" aria-label="Username" aria-describedby="basic-addon1" value={bodyofcomment} onChange={(e)=>{setBody(e.target.value)}}/>
</div>
        
        <button className="btn btn-outline-warning" type="submit" data-bs-dismiss="modal">
          Add Comment
        </button>
</form>
      </div>
      
      {/* <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div> */}
    </div>
    
  </div>
  
</div>
        </div>
      )
     }

    const HandleUpvote = ()=>{
      axios.post('http://localhost:4000/post/upvote',{
        
        id:data.id, 
        email:email, 
      }).then(()=>{
        
        window.location.reload() 
      }).catch((Err)=>{
        console.log("Axios error") 
      })
    }

    const HandleDownvote = ()=>{
      axios.post('http://localhost:4000/post/downvote',{
        
        id:data.id, 
        email:email, 
      }).then(()=>{
        
        window.location.reload() 
      }).catch((Err)=>{
        console.log("Axios error") 
      })
    }
    
    const HandleBookmark = ()=>{
      axios.post('http://localhost:4000/post/bookmark',{
        token: 'BEARER '+ window.localStorage.getItem('myaccesstoken') ,
        id: data.id,
      }).then((res)=>{
        
        window.location.reload() 
      }).catch((err)=>{
        console.log("Error: AXIOS MADARCHOD") 
      })
    }

    const HandleRemoveBookmark = ()=>{
      axios.post('http://localhost:4000/post/delbookmark',{
        token: 'BEARER '+ window.localStorage.getItem('myaccesstoken') ,
        id: data.id,
      }).then((res)=>{
        alert('Done') 
        window.location.reload() 
      }).catch((err)=>{
        console.log("Error: AXIOS MADARCHOD") 
      })
    }

    const HandleReports = ()=>{
      if(data.email === email)
      {
        alert('ALERT: You cannot report yourself!')
        return 
      }
      if(mods.includes(data.email))
      {
        alert('You cannot report a moderator!')
        return 
      }
      axios.post('http://localhost:4000/post/report',{
        reporter:email, 
        reported:data.email, 
        concern:'porn',
        postID:data.id,
        name:sub,
      }).then((res)=>{
        if(res.data.reported === true)
        {

        }

        alert('Reported') 
      })
    }
    
    return(
    <div class="card text w-100">
  <div class="card-header text-center">
    <h3>
    {data.title}
    </h3>
    
  </div>
  <div class="card-body">
    <a href={'/profile/' + data.username} style={{
      textDecoration:'none',
      color:'black',
      fontWeight:'bold' 
    }}>
    <img src={data.profile} width='40' height='40' className="rounded-circle" alt='profile'/> &nbsp;
    {data.username} &nbsp;
    </a> 
    {
      props.name === undefined ? 
      ""
      :
      <a href={'/gr/' + props.name} style={{
        textDecoration:'none',
        color:'black',
        
      }}>(from {props.name})</a>
    }
    
    <p class="card-text">{data.body}</p>
    <div className="row">

    <div className="col">
    {
      data.upvotes.includes(email) === false ? 
      <button className="btn btn-outline-success" onClick={()=>{
        HandleUpvote() 
      }}><img src={upvote} width='20' height='20' alt='op'/> {data.upvotes.length} </button>
       :
       <button className="btn btn-outline-success" disabled>
       <img src={upvote} width='20' height='20' alt='op'/> {data.upvotes.length} </button>
    }
    {/* </div>

<div className="col"> */}
    {
      data.downvotes.includes(email) === false ? 
      
    <button className="btn btn-outline-danger" onClick={()=>{
      HandleDownvote() 
    }}>
      <img src={downvote} width='20' height='20' alt='op'/> {data.downvotes.length} 
    </button>
    :
    <button className="btn btn-outline-danger" disabled>
      <img src={downvote} width='20' height='20' alt='op'/> {data.downvotes.length} </button>
    }

{/* </div>
<div className="col"> */}
{
  props.discomment === false ?
  ""
  :
  <ModalOfComments />
}
    
    </div>

    <div className="col-5"></div>
    <div className="col d-flex flex-row-reverse">
      {console.log("dink: ",dink)}
    {
      bookmark.includes(dink) === true  || props.show === true?
      <button className="btn btn-outline-danger" onClick={
        ()=>{
          HandleRemoveBookmark() 
        }
      }
      data-toggle="tooltip" data-placement="top" title="Remove from Saved Posts"><img src={bookmarkicon} width='20' height='20' alt='op'/></button>
      :
      <button className='btn btn-outline-warning' onClick={()=>{
        HandleBookmark() 
      }}
      data-toggle="tooltip" data-placement="top" title="Add To Saved Posts"><img src={bookmarkicon} width='20' height='20' alt='op'/></button>
    }
    <button className='btn btn-outline-danger' onClick = {()=>{
      HandleReports() 
    }}>
    <img src={report} width='20' height='20' alt='op'/>
       </button>
    </div>
    </div>
  </div>
  <div class="card-footer text-muted">
    Posted on: {getDate(data.created)} 

  </div>
</div>
    )
}

export default Post 
