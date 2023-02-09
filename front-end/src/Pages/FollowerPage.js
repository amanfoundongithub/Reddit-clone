import axios from "axios"
import React,{useEffect, useState} from "react"
import { useParams} from "react-router-dom"
import NavBar from "../Components/Navbar/NavBar"
import logo from '../Components/Images/create.png'
import tags from '../Components/Images/tags.png'
import sad from '../Components/Images/sad.png'
import followers from '../Components/Images/followers.png'
import mode from '../Components/Images/mod.png'
import pencil from '../Components/Images/pencil.png' 
import accept from '../Components/Images/done.png'
import reject from '../Components/Images/reject.png'


const getDate = (date)=>{
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date(date);
    return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}


const FollowerPage = ()=>{


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

    const [editdesc,setED] = useState('')
    const [profURL,setProf] = useState('')
    const [covURL,setCovURL] = useState('') 

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

        axios.post('http://localhost:4000/gr/getdata',{
        list:e.followers,  
    }).then((response)=>{

        setList(response.data.usernames)
        
    }).catch((err)=>{
        console.log("AXIOS ERROR")
    })

        axios.post('http://localhost:4000/gr/getdata2',{
            list:e.pending,
        }).then((response)=>{
            setList2(response.data.usernames)
        }).catch((err)=>{
            console.log("AXIOS ERROR")
        })
    
        
        
        CheckInItOrNot(e.followers,e.moderators,e.pending).then((val)=>{
            MyEmail(val) 
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

    const CheckInItOrNot = async (list1,list2,list4)=>{
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

    const EditGreddiit = async ()=>{

        axios.post('http://localhost:4000/gr/edit',{
            name: details.name, 
            desc:editdesc, 
            profile:profURL,
            cover:covURL,
        }).then((res)=>{

            const result = res.data.edit 

            if(result === 'YES')
            {
                
            }
            else if(result === 'NO')
            {

            }
            else 
            {

            }
        }).catch((err)=>{
            console.log("error AXIOS ")
        })
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

    const [list,setList] = useState([])
    const [list2,setList2] = useState([]) 

    console.log("list2: ",list2) 
    // Make a new component: 
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
                {
                    mod === true ? 
                    ""
                     :
                    ""
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
    <a class="nav-link" aria-current="page" href={'/gr/' + details.name}>Posts</a>
  </li>
  <li class="nav-item">
    <a class="nav-link active" href={"/gr/" + details.name + "/followers"}>Followers</a>
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
                    <div className="w-100 align-items-center" style={{
                        // display:'inline-block'
                    }}>
                        {email === true ?
                        <div>
                        
                        <h5>Followers of gr/{details.name}</h5>
                        </div>
                        : ""

}
                        
                        
                    </div>
                            <br></br>
                            
                    <div className="align-items-center justify-content-center" id='content'>
                        <div className="border border-success">
                            
                        </div>
                        {
                            // Above will be the button that will help us to add the button 
                            details.followers.length === 0 ?
                            <div style={{
                                margin:'auto'
                            }}>
                            <p style={{
                                textAlign:'center',
                                
                            }}>
                                <img src={sad} />
                               &nbsp; No followers yet 
                            </p>
                            </div>
                            :
                            // Display all the posts 
                            <div>
                                {list.map((e)=>{
                                    return(
                                        <div>
                                        <a href={'/profile/' + e.username} style={{
                                            textDecoration:'none'
                                        }}>
                                            <img src={e.profile} width='60' height='60' className="rounded-circle" />
                                            &nbsp;
                                            {e.username} 
                                        </a>
                                        <br></br>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        <br></br>
                        {
                            mod === true ? 
                            <div id='pending'>
                                <h3>Pending Requests</h3>
                                {
                                    list2.map((e)=>{
                                        return(
                                            <div className="border border-success">
                                            <form onSubmit={()=>{
                                                //window.location.reload() 
                                            }}>
                                                <a href={'/profile/' + e.username} style={{
                                            textDecoration:'none'
                                        }}>
                                            <img src={e.profile} width='60' height='60' className="rounded-circle" />
                                            &nbsp;
                                            {e.username + ' '}  &nbsp;
                                        </a>
                                            <p className="my-3" style={{
                                                
                                            }}>{"Reason: "+e.reason}</p>
                                            <button className="btn btn-outline-success" style={{
                                                textAlign:'center'
                                            }}

                                            type='submit'
                                            onClick={
                                                ()=>{
                                                    axios.post('http://localhost:4000/gr/accept',{
                                                        name:details.name, 
                                                        username:e.username, 
                                                        reason:e.reason, 
                                                        email:e.email,
                                                    }).then(()=>{
                                                        console.log("DONE")
                                                        window.location.reload()
                                                    }).catch((err)=>{
                                                        console.log("Error") 
                                                    })
                                                }
                                            }><img src={accept} width='30' height='30'/> </button>
                                            <button className="btn btn-outline-danger" style={{
                                                textAlign:'center'
                                            }}

                                            type='submit'
                                            onClick={
                                                ()=>{
                                                    axios.post('http://localhost:4000/gr/reject',{
                                                        name:details.name, 
                                                        username:e.username, 
                                                        reason:e.reason, 
                                                        email:e.email,
                                                    }).then(()=>{
                                                        console.log("DONE")
                                                        window.location.reload()
                                                    }).catch((err)=>{
                                                        console.log("Error") 
                                                    })
                                                }
                                            }><img src={reject} width='30' height='30'/> </button>
                                            </form>                                            </div>
                                        )
                                    })
                                }
                            </div> 
                            :
                            ""
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

export default FollowerPage 