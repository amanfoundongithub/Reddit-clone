import axios from "axios"
import React,{useEffect, useState} from "react"
import { useNavigate, useParams} from "react-router-dom"
import NavBar from "../Components/Navbar/NavBar"
import logo from '../Components/Images/create.png'
import tags from '../Components/Images/tags.png'
import sad from '../Components/Images/sad.png'
import followers from '../Components/Images/followers.png'
import mode from '../Components/Images/mod.png'
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

const getDate = (date)=>{
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date(date);
    return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}



const VisitStatReturn = (xaxis,yaxis)=>{
    
    return {
        labels: xaxis,
        datasets: [
          {
            label: 'Number of visits',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: yaxis,
          }
        ]
      }
}

const PostReturn = (xaxis,yaxis)=>{

    return {
        labels: xaxis,
        datasets: [
          {
            label: 'Number of posts',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: yaxis,
          }
        ]
      }
}

const FollowerReturn = (xaxis,yaxis)=>{

    for(let i = 1 ; i < xaxis.length ; i++)
    {
        yaxis[i] = yaxis[i - 1] 
    }

    return {
        labels: xaxis,
        datasets: [
          {
            label: 'Number of followers',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: yaxis,
          }
        ]
      }
}

const StatsPage = ()=>{

    const navigate = useNavigate() 
    
    let loggedin = false 
    
    const [mod,setMod] = useState(false) 

   if(window.localStorage.getItem('myaccesstoken'))
   {
        loggedin = true 
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
    })

    const [editdesc,setED] = useState('')
    const [profURL,setProf] = useState('')
    const [covURL,setCovURL] = useState('') 

    // All stats 
    const [xvisit,setxvisit] = useState([])
    const [yvisit,setyvisit] = useState([]) 
    
    // 
    const [xpost,setxpost] = useState([])
    
    // 
    const [xfollow,setxfollow] = useState([]) 

    function newupdate(e)
    {
        if(details.name.length > 0)
        {
            return 
        }
        setDetails(e) 
        setED(e.description)
        setProf(e.profileImageURL)
        setCovURL(e.coverImageURL) 
         
        axios.post('http://localhost:4000/api/gr/getstat',{
        name: name,
    }).then((response)=>{
        setxvisit(response.data.xaxis) 
        setyvisit(response.data.yaxis) 
        setxpost(response.data.zaxis) 
        setxfollow(response.data.taxis) 
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
        axios.post('http://localhost:4000/api/gr/page',{
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


    var title = "SubGreddiit" 

    const listofmenu = [
        {
            title: 'Home',
            href:'/',
        },

    ]

    if(window.localStorage.getItem('current-username'))
    {
        listofmenu.push({
            title:'Profile',
            href:'/profile',
        })
        listofmenu.push({
            title:'Logout',
            href:'/signin',
        })
        listofmenu.push({
            title:'My SubGreddiits',
            href:'/mysg',
        })
        listofmenu.push({
            title:'My Saved Posts',
            href:'/mysaved',
        })
    }
    else 
    {
        listofmenu.push({
            title:'Log In',
            href:'/signin',
        })
    }

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
        let result = await axios.post('http://localhost:4000/api/userdata/profile',{
            token:"BEARER "+window.localStorage.getItem('myaccesstoken')
        })


        let emailid = result.data.message.email 

        console.log("Emailid: ",emailid) 
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

    
    const [list,setList] = useState([])

    
    let det = details.banned.includes(em) 

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
               
                &nbsp;&nbsp;
                {
                    
                    mod === true ?
                    <button className="btn btn-success my-3" disabled>You cannot leave this SubGrediit
                    {
                        console.log("mod: ",mod) 
                    } </button>
                    :
                    ""
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
    <a class="nav-link" href={'/gr/' + details.name + "/editpage"}>Edit SubGreddiit </a>
  </li>:""
  }
   {
    mod === true ? 
    <li class="nav-item">
    <a class="nav-link" href={'/gr/' + details.name + "/reports"}>Reports </a>
  </li>:""
  }
  {
    mod === true ? 
    <li class="nav-item">
    <a class="nav-link active" href={'/gr/' + details.name + "/stats"}>Stats </a>
  </li>:""
  }
</ul>
<br></br>
                    <div className="w-100 align-items-center" style={{
                        // display:'inline-block'
                    }}>
                        {mod === true ?
                        <div>
                        
                        <h5>Stats of gr/{details.name}</h5>
                        </div>
                        : ""

}
                        
                        
                    </div>
                            <br></br>
                            
                    <div className="align-items-center justify-content-center" id='content'>
                        <div >
                            <h3>Trend of Number Of Visits:</h3>
                        <Line data={VisitStatReturn(xvisit,yvisit)} />
                        </div>
                        <br></br>
                        <div >
                            <h3>Trend of Number Of Posts:</h3>
                        <Line data={PostReturn(xvisit,xpost)} />
                        </div>
                        <div >
                            <h3>Trend of Number Of Followers:</h3>
                        <Line data={FollowerReturn(xvisit,xfollow)} />
                        </div>
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

export default StatsPage 