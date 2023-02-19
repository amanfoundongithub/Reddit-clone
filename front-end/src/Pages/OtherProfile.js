import axios from "axios"
import React, { useEffect } from "react"
import { useNavigate, useParams} from "react-router-dom"
import { useState } from "react"
import NavBar from "../Components/Navbar/NavBar"
import Footer from "../Components/Footer/Footer"
import MessagePage from "./Message"


const getDate = (date)=>{
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date(date);
    return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}

function getAge(dateString) {
    dateString.replace('-','')
    var today = new Date();
    var birthDate = new Date(dateString);
    
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


const ViewProfile = ()=>{

    // Get username from the string 
    const {username} = useParams() 


    var arr = [0]

    var title = "My Profile" 

    var listofmenu = [
        {
            title:'Home',
            href:'/',
        },
    ]
    

    if(window.localStorage.getItem("current-username"))
    {
        listofmenu.push( {
        title:'Logout',
        href:'/profile',
    }) }
    
    const navigate = useNavigate() 

    const [details,setDetails] = useState({
        name:{
            firstname:'',
            lastname:''
        },
        followers:[],
        following:[],
        gender:'',
        dob:'2000-01-01',
        membersince:new Date(),
        email:'',
        password:'',
        phone:0,
        about:'',
        _id:'',
        imageurl:'',
    }) 
    const [followers,setIt] = useState([])
    const [following,setIt2] = useState([])



    useEffect(()=>{

    if(arr[0] === 0)
    {
        if(details.name.firstname.length === 0){
        axios.post('http://localhost:4000/userdata/find',{
        username:username,
        token:'BEARER '+window.localStorage.getItem('myaccesstoken') 
    }).then((res)=>{
        
        const output = res.data.transaction 

        if(output === false)
        {
            alert('error')
        }
        else 
        {
            const result = res.data.obtained 
            
            const message = res.data.message 

            if(result === null)
            {
                alert('No such account exists!')
            }
            else 
            {
                if(message === 'LOGGED IN')
                {
                    axios.post('http://localhost:4000/userdata/usernames',{
                    list1:res.data.obtained.followers,
                    list2:res.data.obtained.following,
                }).then((response)=>{
                    
                    setDetails(result) 
                    setIt(response.data.usernames1) 
                    setIt2(response.data.usernames2) 
                    
                })
                    return 
                }
                else 
                {
                    navigate('/profile') 
                    return 
                }
                
            }
        }
    }).catch((err)=>{
        console.log("AXIOS ERROR OCCURED")
    
    })
    arr[0]++}
    }
},arr) 

    // Check if the username is a followed or not 

    const [text,setText] = useState('') 
    const [us,setUs] = useState('') 
    if(window.localStorage.getItem('myaccesstoken')){
    axios.post('http://localhost:4000/userdata/check',{
        token:'BEARER '+window.localStorage.getItem('myaccesstoken'),
        email:details.email,
    }).then((res)=>{
        const us2 = res.data.username 
        const message = res.data.message
        setText(message) 
        setUs(us2) 

    }).catch((err)=>{
        console.log("Error in AXIOS request") 
    })
}

    // Now find the user by posting a server request 
    
    //  Modal creation 
    const Modality = (props)=>{

        const list = props.list 
        const id = props.id 
    
    
            return(
                <div className="container">
                    {/* <!-- Button trigger modal --> */}
                    {props.title === 'Followers' ? 
        <a type="button" className="bg-transparent" data-bs-toggle="modal" data-bs-target={"#"+id} style={{
            textDecoration:'none',
            fontSize:'25px',
            color:'black'
        }}>
        &#128535; {details.followers.length} Followers
        </a>
        :
        <a type="button" className="bg-transparent" data-bs-toggle="modal" data-bs-target={"#"+id} style={{
            textDecoration:'none' ,
            fontSize:'25px',
            color:'black'
        }}>
        &#128527; {details.following.length} Following 
          </a>
        }
        
        
        <div className="modal fade" id={id} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
              {props.title === 'Followers' ? 
        <h1 className="modal-title fs-5" id="exampleModalLabel">
        Followers
        </h1>
        :
        <h1 className="modal-title fs-5" id="exampleModalLabel">
        Following 
          </h1>
        }
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {
                    list.length !== 0 ? 
                    list.map((ele)=>{
                        return (<div className="container"><a type="button" className="bg-transparent" style={{
                            textDecoration:'none' ,
                            fontSize:'25px',
                            color:'black'
                        }}
                        href={'/profile/' + ele} >{ele} </a>
                        <br></br>
                        </div>)
                    })
                    :
                    <p>Oops! No {props.title} </p>
                }
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
        </div>
            )
        }
    // Handles follow request 
    const HandleFollow = ()=>{
        axios.post('http://localhost:4000/userdata/follow',{
            token:'BEARER '+window.localStorage.getItem('myaccesstoken'),
            email:details.email,
        }).then((message)=>{

            const result = message.data.message 


            window.location.reload() 
        }).catch((err)=>{
            console.log("AXIOS REQUEST ERROR")
        })
    }

    const HandleUnfollow = ()=>{
        axios.post('http://localhost:4000/userdata/unfollow',{
            token:'BEARER '+window.localStorage.getItem('myaccesstoken'),
            email:details.email,
        }).then((message)=>{

            const result = message.data.message 

            window.location.reload() 
        }).catch((err)=>{
            console.log("AXIOS REQUEST ERROR")
        })
    }


    // Make a modal for chat 
    const ChatModal = () => {
        return (
            <div>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#chat">
                    Chat with {details.username} 
                </button>


                <div class="modal fade" id="chat" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">My Chats with {details.username}</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                               
                               {
                                us.length != 0 ?
                                <MessagePage to={details.username} from={us} />
                                : 
                                ""
                               }
                                
         
                           </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close Chat Box</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className="App">
        <NavBar isdropdown={false} issearch={false} listofmenu={listofmenu} title={title}/>
        <div className="row">
            <div className="col my-4 justify-content-center text-center">
                <img src={details.imageurl} className="rounded-circle" width="300" height="300" alt="Profile"/>
            </div>
            <div className="col my-4 display-6 justify-content-center" id="display basic info">
            {
                details.username 
            } 
            <p className="h4">{'(' + details.name.firstname + ' ' + details.name.lastname + ')'}</p>

            <p className="h3">{getAge(details.dob) + ' years old, ' + details.gender}</p>
            
            <p className="text-muted" style={{
                fontSize:'25px',
                fontFamily:'Brush Script MT,cursive'
            }}>{details.about}</p>
            {
                /*
                Following button for the person if logged in 
                */
            }
            {
                window.localStorage.getItem("current-username") != null ?
                <div className="container">
                    {
                        text === 'Unfollow'? 
                        <button className="btn btn-info w-100" onClick={()=>{HandleUnfollow()}}>
                            Unfollow {details.username}
                        </button>
                        :
                        <button className="btn btn-info w-100" onClick={()=>{HandleFollow()}}>
                            Follow {details.username} 
                        </button>
                    }
                </div>
                :
                <div className="container">

                    </div>
            }
            {
                window.localStorage.getItem("current-username") != null ?
                details.username != undefined ?
                <ChatModal />
                :
                ""
                :
                ""
            }
            </div>
            <div className="col my-4 display-4 justify-content-center" id="display basic info">
                <p className="h3">{details.username}'s Stats:</p>
                <p className="h4">&#10004; &nbsp; Member since {getDate(details.membersince)} </p>
                {/* <p className="h4">&#128535; {details.followers.length} Followers</p>
                <p className="h4"> &#128527; {details.following.length} Following </p> */}
                <Modality title='Followers' list={followers} id="followers"/> 
                <Modality title='Following' list={following} id="following"/>
            </div>
            
        </div>
        <Footer />
        </div> 
    )
}

export default ViewProfile