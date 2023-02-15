import React,{useState} from "react"
import axios from 'axios' 
import { useParams } from "react-router-dom"
import NavBar from "../Components/Navbar/NavBar"
import logo from '../Components/Images/create.png'
import tags from '../Components/Images/tags.png'
import sad from '../Components/Images/sad.png'
import followers from '../Components/Images/followers.png'
import mode from '../Components/Images/mod.png'
import accept from '../Components/Images/done.png'
import reject from '../Components/Images/reject.png'


const getDate = (date)=>{
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date(date);
    return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}


const ReportedPostPage = ()=>{
    let loggedin = false 
    
    const [mod,setMod] = useState(false) 

    const [listit,setListIt] = useState([]) 

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
        banned:[],
        reports:[],
    })

    const [editdesc,setED] = useState('')
    const [profURL,setProf] = useState('')
    const [covURL,setCovURL] = useState('') 

    function update(E)
    {
        if(E.length === 0 || details.reports.length > 0)
        {
            return 
        }
        setListIt(E) 
    }
    function newupdate(e)
    {
        // console.log("details:",details) 
        if(details.name.length > 0)
        {
            return 
        }
        setDetails(e) 
        setED(e.description)
        setProf(e.profileImageURL)
        setCovURL(e.coverImageURL) 



        // axios.post('http://localhost:4000/gr/usernameofreports',{
        //     list1:e.reports, 
        // }).then((resp)=>{
        //     console.log("Resp: ",resp)

        //     setListIt(resp.data.out) 
        //     console.log('listit: ',listit)
        // }).catch((err)=>{
        //     console.log("AXIOS ERROR REQUEST")
        // })
        
        CheckInItOrNot(e.followers,e.moderators,e.pending,e.reports).then((val)=>{
            MyEmail(val) 
        }).catch((err)=>{
            console.log("UNEXPECYE ERROR") 
            console.log(err) 
        })
        console.log("HERE")
    }

    // var count = 0 
        axios.post('http://localhost:4000/gr/page',{
        name:name, 
    }).then((res)=>{

        const message = res.data.message 

        if(message === 'INVALID')
        {
            alert('Invalid Greddiit name!')
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


    const CheckInItOrNot = async (list1,list2,list4,list5) =>{
        if(loggedin === false )
        {
            return false 
        }

        // Logged in 
        let result = await axios.post('http://localhost:4000/userdata/profile',{
            token:"BEARER "+window.localStorage.getItem('myaccesstoken')
        })

        
        let emailid = result.data.message.email 
        
        setEm(emailid) 

        setPhoto(result.data.message.imageurl)  

        

        let result2 = await axios.post('http://localhost:4000/gr/usernameofreports',{
            list1:list5, 
        })

        let find = result2.data.out
        console.log(result2.data.out) 
        setListIt(find)


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
            let result = res.data.added 

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
            let result = res.data.added 

            alert('result: ',res.data) 
            window.location.reload() 
        }).catch((err)=>{
            console.log("Error") 
        })
    }


     
    let det = details.banned.includes(em) 

    axios.post('http://localhost:4000/gr/usernameofreports',{
            list1: details.reports,  
        }).then((val)=>{
            update(val.data.out) 
        }).catch((err)=>{
            console.log("Error: ",err) 
        })

    const DeleteThePost = (id,id2)=>{
        console.log("id: ",id) 
        axios.post('http://localhost:4000/post/deletepost',{
            id: id,
            report:id2, 
        }).then((res)=>{
            if(res.data.success === true)
            {
                alert('done')
            }
            else 
            {
                alert('undone')
            }
        }).catch((err)=>{
            console.log("LODA AXIOS ERROR")
        })
    }

    const BlockUser = (e)=>{
        console.log("em: ",e)
        axios.post('http://localhost:4000/gr/unfollow',{
            name: name, 
            email: e,
        }).then((res)=>{
            alert('Reported the user')
            window.location.reload() 
        })
    }
    
    // Modal to represent the data

    const ShowReportedPost = (props)=>{

        const id = props.id 

        const post = props.post 

        console.log("post: ",post) 

        console.log("id: ",id) 

        const [arr,setArr] = useState({
            title:'',
             
            content:'', 

            createdAt:'', 
            // Created by whom stores email address 
            createdBy:'',
            // Upvotes 
            upvotes:[],
            // downvotes 
            downvotes:[],
            // comments
            comments:[],
            
        })

        const LocalUpdate = (e)=>{
            
            if(e === null || e.title === '' || arr.title.length > 0)
            {
                return 
            }
            setArr(e) 
        }
        axios.post('http://localhost:4000/post/reportdata',{
            id:post,
        }).then((res)=>{
            if(res.data.data === undefined)
            {
                return 
            }
            LocalUpdate(res.data.data) 
        })
        return(
            <div>
                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target={"#exampleModal" + id} id={id}>
                    Show The Post 
                </button>


                <div class="modal fade" id={"exampleModal" + id} tabindex="-1" aria-labelledby={"exampleModalLabel" + id} aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Post Description</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                
                                <h3>Title: {arr.title}</h3>
                                <p>{arr.content}</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-info" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
</div>
        )

    }





    return(
        <div className="container-fluid">
            <NavBar isdropdown={false} issearch={false} listofmenu={listofmenu} title={title}/>
            <div className="container-fluid">
                <img src={details.coverImageURL} height='200' style={{
                    width:'100%',
                    
                }}/>
                
                <div className="container-fluid justify-content-center text-center" style={{
                display:'flex'
            }}>  
                <img src={details.profileImageURL} className="rounded-circle" style={{
                    // width:'4%',
                    
                }} width='80' height='80'/>
            
                <span className="h4 my-4">&nbsp;&nbsp; gr/{details.name}&nbsp;&nbsp;</span>
              
                &nbsp;&nbsp;
                {
                    mod === true ?
                    <button className="btn btn-success my-3" disabled>You cannot leave this SubGrediit </button>
                    :
                    email === true && det === false? 
                    <button className="btn btn-danger my-3" onClick={
                        ()=>{
                            UnFollow() 
                        }
                    }>Leave This SubGreddiit</button>
                    :
                    pending === false && det === false?
                    <button className="btn btn-success my-3" onClick={()=>{
                        Follow() 
                    }}>Follow This SubGreddiit </button>
                    :
                    det === false ? 
                    <button className="btn btn-success my-3" disabled>Pending Request </button>
                    :
                    <button className="btn btn-primary my-3" disabled>You cannot join this subGreddiit</button>
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
    <a class="nav-link" aria-current="page" href={'/gr/' + details.name}>Posts</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href={"/gr/" + details.name + "/followers"}>Followers</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href={"/gr/" + details.name + "/mod"}>Moderators</a>
  </li>
  {
    mod === true ? 
    <li class="nav-item">
    <a class="nav-link" href={'/gr/' + details.name + "/editpage"}>Edit SubGreddiit</a>
  </li>:""
  }
   {
    mod === true ? 
    <li class="nav-item">
    <a class="nav-link active" href={'/gr/' + details.name + "/reports"}>Reports</a>
  </li>:""
  }
   {
    mod === true ? 
    <li class="nav-item">
    <a class="nav-link" href={'/gr/' + details.name + "/stats"}>Stats </a>
  </li>:""
  }
</ul>
<br></br>
                    <div className="w-100 align-items-center" style={{
                        // display:'inline-block'
                    }}>
                        {email === true ?
                        <div>
                        
                        <h5>Reports in gr/{details.name}</h5>
                        </div>
                        : ""

}
                        
                        
                    </div>
                            <br></br>
                            
                    <div className="align-items-center justify-content-center" id='content'>
                        <div className="border border-success">
                            {
                                console.log("Detail:",details.reports) 
                            }
                        </div>
                        {
                            
                            // Above will be the button that will help us to add the button 
                            details.reports.length === 0 ?
                            <div style={{
                                margin:'auto'
                            }}>
                            <p style={{
                                textAlign:'center',
                                
                            }}>
                                <img src={sad} />
                               &nbsp; No reports yet! You are all caught up! 
                            </p>
                            </div>
                            :
                            // Display all the posts 
                            <div>
                               
                                {details.reports.map((e,index)=>{
                                    
                                    if(listit.length === 0 ) 
                                    {
                                        return <></>
                                    }
                                    let element = listit[index] 

                                
                                    return(
                                        <div>
                                        <div class="card">
                                            <div class="card-header">
                                                Report #{index + 1}
                                            </div>
                                            <div class="card-body">
                                                {
                                                    console.log("e: ",e) 
                                                }
                                                <h5 class="card-title">Reported By &nbsp; &nbsp; &nbsp;:&nbsp;
                                                <img src={element.profilereporter} width='40' height='40' className="rounded-circle"/>&nbsp;
                                                {element.usernamereporter}</h5>
                                                <h5 class="card-title">Reported User&nbsp;&nbsp;: &nbsp;
                                                <img src={element.profilereported} width='40' height='40' className="rounded-circle"/>&nbsp;
                                                {element.usernamereported}</h5>
                                                <p class="card-text">Concern: {e.Concern}</p>
                                                <ShowReportedPost id={e._id} post={e.postID}/>
                                                <br></br>
                                                <h5>Select An Action: </h5>
                                                {
                                                    e.blockButton === false ? 
                                                    <button className="btn btn-outline-danger"
                                                onClick={()=>{
                                                    DeleteThePost(e.postID,e._id) 
                                                }}>
                                                    Delete The Post
                                                </button>
                                                :
                                                <button className="btn btn-outline-danger"
                                                onClick={()=>{
                                                    DeleteThePost(e.postID) 
                                                }} disabled >
                                                    Delete The Post
                                                </button>
                                                }
                                                {
                                                    e.blockButton === false ?
                                                    <button className="btn btn-outline-danger"
                                                onClick={()=>{
                                                    BlockUser(e.reported)  
                                                }}>
                                                    Block User 
                                                </button>
                                                    :
                                                    <button className="btn btn-outline-danger"
                                                onClick={()=>{
                                                    BlockUser(e.reported)  
                                                }} disabled>
                                                    Block User 
                                                </button>
                                                }
                                                <button className="btn btn-outline-info" onClick={()=>{
                                                    axios.post('http://localhost:4000/post/ignore',{
                                                        post2:e._id,
                                                        post:e.postID,
                                                    }).then(()=>{
                                                        window.location.reload() 
                                                    })
                                                }}>
                                                    Ignore This Report
                                                </button>
                                            </div>
                                            <div class="card-footer text-muted">
                                                Reported On: <h5>{getDate(e.reportedOn)}</h5>
                                                </div>
                                        </div>
                                        <br></br>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        <br></br>
                        
                            
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

export default ReportedPostPage