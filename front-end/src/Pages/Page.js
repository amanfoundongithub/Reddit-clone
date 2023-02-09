import axios from "axios"
import React,{useState} from "react"
import { useParams} from "react-router-dom"
import NavBar from "../Components/Navbar/NavBar"
import logo from '../Components/Images/create.png'
import tags from '../Components/Images/tags.png'
import sad from '../Components/Images/sad.png'
import followers from '../Components/Images/followers.png'
import mode from '../Components/Images/mod.png'
import Post from "../Components/Page/Post"
import { useNavigate } from "react-router-dom"

const getDate = (date)=>{
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date(date);
    return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}


const Page = ()=>{


    let loggedin = false 
    
    const [mod,setMod] = useState(false) 

    if(window.localStorage.getItem('current-username'))
    {
        loggedin  = true 
    }
    
    const {name} = useParams() 


    // Get all details of the name 
    const [details,setDetails] = useState({
        name:'',
        description:'',
        profileImageURL:'',
        coverImageURL:'',
        tags:[],
        bannedKeywords:[],
        moderators:[],
        followers:[],
        pending:[],
        posts:[],
        createdOn: new Date(),
    })

    // const [editdesc,setED] = useState('')
    // const [profURL,setProf] = useState('')
    // const [covURL,setCovURL] = useState('') 
    const [url,setUrl] = useState([]) 


    const navigate = useNavigate() 

    function newupdate(e)
    {
        if(details.name.length > 0)
        {
            return 
        }
        setDetails(e) 
        // setED(e.description)
        // setProf(e.profileImageURL)
        // setCovURL(e.coverImageURL) 
        
        CheckInItOrNot(e.followers,e.moderators,e.posts,e.pending).then((val)=>{
            MyEmail(val) 
            // DoStuff(e) 
        }).catch((err)=>{
            console.log("UNEXPECYE ERROR") 
            console.log(err) 
        })
        // console.log("HERE")
    }

    // var count = 0 
        axios.post('http://localhost:4000/gr/page',{
        name:name, 
    }).then((res)=>{

        const message = res.data.message 

        if(message === 'INVALID')
        {
            alert('Invalid Greddiit name!')
            navigate('/profile')
            return 
        }
        else 
        {
            newupdate(res.data.data)
        }
    })


    var title = "My Profile" 

    var listofmenu = [
        {
            title:'Home',
            href:'/',
        },
        {
            title:'Logout',
            href:'/profile',
        },
        {
            title:'My SubGreddiits',
            href:'/mysg',
        }
    ]

    if(loggedin === false)
    {
        listofmenu = [
            {
                title:'Home',
                href:'/',
            },
            {
                title:'Sign In',
                href:'/signin',
            },
            
        ]
    }

    const [email,MyEmail] = useState(false) 
    const [photo,setPhoto] = useState('')
    const [em,setEm] = useState('') 
    const [pending,setPending] = useState(false) 
    const [arr,setArr] = useState([]) 

    const CheckInItOrNot = async (list1,list2,list3,list4)=>{
        if(loggedin === false )
        {
            return false 
        }

        // Logged in 

        let result = await axios.post('http://localhost:4000/userdata/profile',{
            token:"BEARER "+window.localStorage.getItem('myaccesstoken')
        })

        let result2 = await axios.post('http://localhost:4000/post/getdata',{
            token:"BEARER "+window.localStorage.getItem('myaccesstoken'),
            body:list3
        })

        setUrl(result2.data.output)

        
        let emailid = result.data.message.email 
        
        setEm(emailid) 

        setArr(result.data.message.savedPosts) 

        setPhoto(result.data.message.imageurl)  

        const func = ()=>{
            for(let i = 0 ; i < list4.length ; i++)
            {
                let e = list4[i] 

                if(e.email === emailid)
                {
                    return true 
                }
            }
            return false 
        }
        if(list2.includes(emailid))
        {
            setMod(true) 
            return true 
        }
        else if(list1.includes(emailid))
        {
            return true 
        }
        else if(func()) 
        {
            setPending(true)
            return false 
        }
        else 
        {
            return false 
        }
    }

    

    const Follow = ()=>{

        let answer = window.prompt('Last Step: Tell us a good reason why should you join the SubGreddiit?',
        'I want to join this subgreddiit') 

        axios.post('http://localhost:4000/gr/follow',{
            name:details.name, 
            email:em,
            reason:answer, 
        }).then((res)=>{
            
            window.location.reload() 
        }).catch((err)=>{
            console.log("Error") 
        })
    }

    const UnFollow = ()=>{

        axios.post('http://localhost:4000/gr/unfollow',{
            name:details.name, 
            email:em,
        }).then((res)=>{
             
            window.location.reload() 
        }).catch((err)=>{
            console.log("Error") 
        })
    }

    const ModalOfPost = ()=>{

        const [title,setTitle] = useState('')
        const [body,setBody] = useState('')

        const CheckBanned = ()=>{
            
            for(let i = 0 ; i < details.bannedKeywords.length ; i++)
            {
                if(body.includes(details.bannedKeywords[i]))
                {
                    return true 
                }
            }

            return false 
        }

        const RemoveBannedKeywords = ()=>{
            
        

        }

        return(
            <div>
                <img src={photo} className='rounded-circle' width='80' height='80' alt='Alternate'/>
            <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <div style={{
                    display:'inline-block'
                }}>
            
            <input className="w-75" placeholder="Draft a new post..." />
            </div>
</button>


<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Draft A New Post</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div className="input-group mb-3">
  <span className="input-group-text" id="inputGroup-sizing-default3">Title:</span>
  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default3"
  value={title} onChange={(e)=>{setTitle(e.target.value)}}/> 
  {/* <p style={{
                                    fontFamily:'Garamond',
                                    fontSize:'20px'
                                }}>A username is how you are represented in the Grediiit world! 
                                But as we say, keep your username cool ... and unique!
                                In most cases, you can easily choose a username, but make sure it is
                                unique and cool !  </p> */}
</div>
<div className="input-group mb-3">
  <span className="input-group-text" id="inputGroup-sizing-default5">Post Body:</span>
  <textarea type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default5"
  value={body} onChange={(e)=>{setBody(e.target.value)}}/> 
  {/* <p style={{
                                    fontFamily:'Garamond',
                                    fontSize:'20px'
                                }}>How can someone follow you if they don't know about you? And besides you can 
                                get to know about other people also by reading their abouts! </p> */}
</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onClick={
            ()=>{

                let temp = body 
                if(CheckBanned() === true)
                {
                    let output = window.confirm('ALERT: Your post has been detected to contain some banned keywords! \
                    Are you really sure you want to submit this post? If you post, all the banned keywords will \
                    be just hidden.')

                    if(output === false)
                    {
                        return  
                    }
                    else 
                    {
                        for (let i = 0; i < details.bannedKeywords.length; i++) {
                            let s = ''
                            for (let j = 0; j < details.bannedKeywords[i].length; j++) {
                                s = s + '*'
                            }

                            console.log("s: ",s) 
                            temp = temp.replace(details.bannedKeywords[i], s)
                        }
                    }
                }

                console.log("value of body: ",temp)  
                let out = window.confirm('Are you sure you want to upload this post? ')
                if(out === false)
                {
                    return 
                }
                axios.post('http://localhost:4000/post/create',{
                    name:name, 
                    title:title, 
                    body:temp, 
                    token:'BEARER '+ window.localStorage.getItem('myaccesstoken')
                }).then((res)=>{
                    if(res.data.created)
                    {
                        console.log("CREATED A POST")
                        window.location.reload() 
                    }
                    else 
                    {
                        console.log("OL HONFJG")
                    }

                }).catch((err)=>{
                    console.log("Error axios: ",err)
                })
            }
        }>Post This</button>
      </div>
    </div>
  </div>
</div>
</div>
        )
    }

    // Make a new component: 
    return(
        <div className="container-fluid">
            <NavBar isdropdown={false} issearch={false} listofmenu={listofmenu} title={title}/>
            <div className="container-fluid">
                <img src={details.coverImageURL} height='200' style={{
                    width:'100%',
                    
                }} alt='Alternate'/>
                
                <div className="container-fluid justify-content-center text-center" style={{
                display:'flex'
            }}>  
                <img src={details.profileImageURL} className="rounded-circle" style={{
                    // width:'4%',
                    
                }} width='80' height='80' alt='Alternate'/>
            
            
                <span className="h4 my-4">&nbsp;&nbsp; gr/{details.name}&nbsp;&nbsp;</span>
                {
                    console.log("pending: ",pending) 
                }
                &nbsp;&nbsp;
                {
                    email === true ? 
                    <button className="btn btn-danger my-3" onClick={
                        ()=>{
                            UnFollow() 
                        }
                    }>Leave This SubGreddiit</button>
                    :
                    pending === false ?
                    <button className="btn btn-success my-3" onClick={()=>{
                        Follow() 
                    }}>Follow This SubGreddiit </button>
                    :
                    <button className="btn btn-success my-3" disabled>Pending Request </button>
                }
                </div>
                {
                    // Main body of the page 
                }
                <br></br>
                <div className="row" id='main-body'>

                    <div className="col ">
                        
                    </div>
                    <div className="col-6">
                    <ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href={'/gr/' + details.name}>Posts</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href= {"/gr/" + details.name + "/followers"}>Followers</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href={"/gr/" + details.name + "/mod"}>Moderators</a>
  </li>
  {
    mod === true ? 
    <li class="nav-item">
    <a class="nav-link" href={'/gr/' + details.name + "/editpage"}>Edit SubGreddiit (for moderators)</a>
  </li>:""
  }
</ul>
<br></br>
                    <div className="border border-success w-100 align-items-center" style={{
                        // display:'inline-block'
                    }}>
                        {email === true ?
                        <div>
                        <ModalOfPost />
                        </div>
                        : ""

}
                           
                    </div>
                            <br></br>
                            
                    <div className="d-flex align-items-center justify-content-center" id='content'>
                        <div className="border border-success">
                            
                        </div>
                        {
                            // Above will be the button that will help us to add the button 
                            details.posts.length === 0 ?
                            <div style={{
                                margin:'auto'
                            }}>
                            <p style={{
                                textAlign:'center',
                                
                            }}>
                                <img src={sad} alt='Alternate'/>
                                Looks like you don't have any posts here till now
                            </p>
                            </div>
                            :
                            // Display all the posts 
                            <div>
                                {
                                    details.posts.reverse().map((val,index)=>{
                                     
                                        if(url.length === 0)
                                        {
                                            return <></>
                                        }
                                        return(
                                            <div className="">
                                            {
                                                console.log("arr: ",arr) 
                                            }
                                            <Post data={url[index]} current={em} arr={arr}/>
                                            <br></br>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                            
                    </div>
                    </div>
                    
                    <div className="col justify-content-center" id='about' >
                        <div class="card" style={{
                            width:'18em',
                            height:'32em',
                            margin:'auto'
                        }}>

                            <div class="card-body" style={{
                                backgroundColor:'blue',
                                height:'0.25em'
                            }}>
                                
                                <h5 class="card-title" style={{
                                    textAlign:'center',
                                    color:'white'
                                }}>About This SubGreddiit</h5>
                            </div> 
                            <div className="card-body">
                                <p class="card-text">
                                    {details.description}</p>
                                {
                                    /*
                                    Describe the format
                                     */
                                }
                            </div>
                            <div className="card-body">
                                <p className="text-muted">
                                <img src={logo} alt="Created" height='20' width='20'/> &nbsp;Created on {getDate(details.createdOn)}</p>
                                
                                <p className="text-muted">
                                <img src={followers} alt="Followers" width='20' height='20'/>&nbsp;&nbsp;Followed by {details.followers.length} people</p>

                                <p className="text-muted">
                                <img src={mode} alt="Mod" width='20' height='20'/>&nbsp;&nbsp;Moderated by {details.moderators.length} people</p>
                            </div>
                            
                            
                            <div class="card-body">
                            <img src={tags} alt="existed"/>
                                <p className="text-muted">sg/{details.name}'s Tags:</p>
                                
                                {
                                    details.tags.map((e,i)=>{
                                        
                                        return(
                                            <span className="" style={{
                                                backgroundColor:'green',
                                                color:'white',
                                                borderStyle:'solid',
                                                fontSize:'1em',
                                                borderRadius:'1em',
                                                width:'2em',
                                                padding:'0.35em'
                                            }}>
                                                {e} </span>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                
            </div>
        
    )
}

export default Page 