import axios from "axios"
import React,{useEffect, useState} from "react"
import { useNavigate, useParams} from "react-router-dom"
import NavBar from "../Components/Navbar/NavBar"
import logo from '../Components/Images/create.png'
import tags from '../Components/Images/tags.png'
import sad from '../Components/Images/sad.png'
import followers from '../Components/Images/followers.png'
import mode from '../Components/Images/mod.png'
import pencil from '../Components/Images/pencil.png' 

const getDate = (date)=>{
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date(date);
    return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}


const EditPage = ()=>{


    const navigate = useNavigate() 
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

        CheckInItOrNot(e.followers,e.moderators).then((val)=>{
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
    const [user,setUser] = useState('') 
    const [em,setEm] = useState('') 

    const CheckInItOrNot = async (list1,list2)=>{
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

        setUser(result.data.message.username) 

    
        if(list2.includes(emailid))
        {
            setMod(true) 
            return true 
        }
        // else if(list1.includes(emailid))
        // {
        //     navigate('/gr/' + name) 
        //     return true 
        // }
        // else 
        // {
        //     navigate('/gr/' + name ) 
        //     return false 
        // }
        else 
        {
            navigate('/gr/' + name) 
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
                alert('Edited')
                window.location.reload() 
            }
            else if(result === 'NO')
            {
                alert('NO')
                window.location.reload() 
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

            alert('result: ',res.data) 
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

    // Make a new component: 
    return(
        <div className="container-fluid">
            <NavBar isdropdown={false} issearch={false} listofmenu={listofmenu} title={title} />
            <div className="container-fluid">
                <img src={details.coverImageURL} height='200' style={{
                    width: '100%',

                }} />

                <div className="container-fluid justify-content-center text-center" style={{
                    display: 'flex'
                }}>
                    <img src={details.profileImageURL} className="rounded-circle" style={{
                        // width:'6%',

                    }} width='80' height='80' />

                    <span className="h4 my-4">&nbsp;&nbsp; gr/{details.name}&nbsp;&nbsp;</span>

                    &nbsp;&nbsp;
                    {
                        mod === true ?
                            <button className="btn btn-success my-3" disabled>You cannot leave this SubGrediit </button>
                            :
                            email === true ?
                                <button className="btn btn-danger my-3" onClick={
                                    () => {
                                        UnFollow()
                                    }
                                }>Leave This SubGreddiit</button>
                                :
                                <button className="btn btn-success" onClick={
                                    () => {
                                        Follow()
                                    }
                                }>Follow This SubGreddiit </button>
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
                                        <a class="nav-link active" href={'/gr/' + details.name + "/editpage"}>Edit SubGreddiit </a>
                                    </li> : ""
                            }
                            {
                                mod === true ?
                                    <li class="nav-item">
                                        <a class="nav-link" href={'/gr/' + details.name + "/reports"}>Reports </a>
                                    </li> : ""
                            }
                        </ul>
                        <br></br>


                        <div className=" w-100 align-items-center" style={{
                            // display:'inline-block'
                        }}>
                        {
                            mod === true ? 
                            <div>

                                <p style={{
                                    fontSize: '25px',
                                    textAlign: 'center'
                                }}>
                                    [ <img src={photo} className='rounded-circle' width='80' height='80' />
                                    You are editing this page as {user} ]</p>
                            </div>
                            :
                            ""
                        }


                        </div>
                        <br></br>
                        {
                            mod === true ?
                        <div className="" id='content'>
                            <h3 style={{
                                textAlign: 'center'
                            }}>Edit This SubGreddiit Details</h3>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="inputGroup-sizing-default3">Description:</span>
                                <textarea type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default3"
                                    value={editdesc} onChange={(e) => { setED(e.target.value) }} />
                                <p style={{
                                    fontFamily: 'Garamond',
                                    fontSize: '20px'
                                }}>Hint: Keeping a good description often sums up about the
                                    subgreddiit and might help to increase followers of the
                                    subgreddiit !  </p>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="inputGroup-sizing-default4">Profile Image URL:</span>
                                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default4"
                                    value={profURL} onChange={(e) => { setProf(e.target.value) }} />

                                <p style={{
                                    fontFamily: 'Garamond',
                                    fontSize: '20px'
                                }}>Keep a cool dp is a pro tip!  </p>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="inputGroup-sizing-default4">Cover Image URL:</span>
                                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default4"
                                    value={covURL} onChange={(e) => { setCovURL(e.target.value) }} />

                                <p style={{
                                    fontFamily: 'Garamond',
                                    fontSize: '20px'
                                }}>Cover Image URL </p>


                            </div>

                            <button className="btn btn-outline-warning w-100 my-3" onClick={() => {
                                EditGreddiit()
                            }}>
                                Edit This SubGreddiit
                            </button>

                        </div>
                        : ""
                        }
                    </div>


                    <div className="col justify-content-center" id='about' >
                        <div class="card" style={{
                            width: '18em',
                            height: '32em',
                            margin: 'auto'
                        }}>

                            <div class="card-body" style={{
                                backgroundColor: 'blue',
                                height: '0.25em'
                            }}>

                                <h5 class="card-title" style={{
                                    textAlign: 'center',
                                    color: 'white'
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
                                    <img src={logo} alt="Created" height='20' width='20' /> &nbsp;Created on {getDate(details.createdOn)}</p>

                                <p className="text-muted">
                                    <img src={followers} alt="Followers" width='20' height='20' />&nbsp;&nbsp;Followed by {details.followers.length} people</p>

                                <p className="text-muted">
                                    <img src={mode} alt="Mod" width='20' height='20' />&nbsp;&nbsp;Moderated by {details.moderators.length} people</p>
                            </div>


                            <div class="card-body">
                                <img src={tags} alt="existed" />
                                <p className="text-muted">sg/{details.name}'s Tags:</p>
                                {
                                    details.tags.map((e, i) => {

                                        return (
                                            <span className="" style={{
                                                backgroundColor: 'green',
                                                color: 'white',
                                                borderStyle: 'solid',
                                                fontSize: '1em',
                                                borderRadius: '1em',
                                                width: '2em',
                                                padding: '0.35em'
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

export default EditPage 