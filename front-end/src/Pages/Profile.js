import React, { useEffect ,useState} from "react"
import NavBar from "../Components/Navbar/NavBar"
import { useNavigate } from "react-router-dom"
import Footer from "../Components/Footer/Footer";
import axios from "axios";


const getDate = (date)=>{
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date(date);
    return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}

function getAge(dateString) {
    dateString.replace('-','')
    console.log(dateString)
    var today = new Date();
    var birthDate = new Date(dateString);
    console.log("birthdate",birthDate) 
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const Profile = ()=>{

    const navigate = useNavigate() 

    useEffect(()=>{
        console.log("username: ",window.localStorage.getItem("current-username")) 
        if(window.localStorage.getItem("current-username") !== 'yes')
        {
            navigate('/signin')
            
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
        },
        {
            title:'My Saved Posts',
            href:'/mysaved',
        },
    ]

    // DETAILS 
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
        imageurl:'',
    }) 

    // EDIT DETAILS
    const [newfname,setfname] = useState(details.name.firstname) 
    const [newlname,setlname] = useState(details.name.lastname) 
    const [newusername,setusername] = useState(details.username) 
    const [phone,setphone] = useState(details.phone)  
    const [about,setabout] = useState(details.about) 
    const [imageurl,setImageURL] = useState(details.imageurl) 

    // FOLLOWERS AND FOLLOWING 
    const [followers,setFollowers] = useState([])
    const [following,setFollowing] = useState([])
    
    function changedata(e,list1,list2){
        if(details.email !== '')
        {
            return 
        }
        setDetails(e);
        setFollowers(list1)
        setFollowing(list2) 

    }

    var id = window.localStorage.getItem("current-username") 

    console.log("id : ",id) 

        // if not return details
        axios.post('http://localhost:4000/userdata/profile',{
            id:id,
            token:"BEARER "+window.localStorage.getItem('myaccesstoken')
        }).then((res)=>{
            // console.log("res: ",res.data.message)
            if(res.data.message != null)
            {
                axios.post('http://localhost:4000/userdata/usernames',{
                    list1:res.data.message.followers,
                    list2:res.data.message.following,
                }).then((response)=>{
                    console.log("response:",response)
                    changedata(res.data.message,response.data.usernames1,response.data.usernames2);
                })
                // changedata(res.data.message,res.data.message.followers,res.data.message.following); 
                if(newfname.length === 0){
                setfname(details.name.firstname)
                setlname(details.name.lastname) 
                setusername(details.username) 
                setphone(details.phone) 
                setabout(details.about) 
                setImageURL(details.imageurl) 
                }
            }

        }).catch((err)=>{
            console.log("Error")
            console.log(err) 
        })


    
    const HandleEdit = ()=>{
        // Handles the edit button 
        const exponent=  window.confirm("Are you sure you want to edit your details? ")

        if(!exponent)
        {
            return 
        }

        // Handles edits 
        axios.post('http://localhost:4000/userdata/editprofile',{
            id:id, 
            token:'BEARER '+ window.localStorage.getItem('myaccesstoken'),
            username: newusername,
            name:{
                firstname:newfname,
                lastname:newlname,
            },
            phone:phone,
            about:about,
            imageurl:imageurl, 
        }).then((res)=>{
            
            const output = res.data.created 
            
                alert('Account has been updated! Page will be refreshed shortly...')
                window.location.reload() 
        })
    }

    

    // Create modal
    const Modality = (props)=>{

    const list = props.list 
    const id = props.id 

    console.log("inside modality: ",list) 

    const RemoveFollower = (emailoffollower)=>{

        axios.post('http://localhost:4000/userdata/removefollower',{
            follower: emailoffollower, 
            email : details.email,
        }).then((res)=>{
            if(res.data.success === true)
            {
                alert('removed from follower')
                window.location.reload() 
            }
        })
    }

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
                list.map((ele,index)=>{
                    return (<div className="container"><a type="button" className="bg-transparent" style={{
                        textDecoration:'none' ,
                        fontSize:'25px',
                        color:'black'
                    }}
                    href={'/profile/' + ele} >{ele} &nbsp;</a>
                    {
                        props.title === 'Followers' ?
                        <button className="btn btn-outline-danger" onClick={
                            ()=>{
                                RemoveFollower(details.followers[index]) 
                            }
                        }>Remove as follower</button>
                        :
                        ""
                    }
                    
                    <br></br>
                    </div>)
                })
                :
                <p>Oops! No {props.title} </p>
            }
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    </div>
        )
    }
    return(
        details.password.length !== 0 ?
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
            <button className="btn btn-outline-info" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
                Edit Profile
            </button>
                        <div className="offcanvas offcanvas-start" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="staticBackdropLabel">Edit Your Profile</h5>
                                <button type="button" className="btn-close btn-sm" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body">
                            
                                <div id="text" className="input-group my-3" >
            <span className="input-group-text">Full Name:</span>
            <input type="text" aria-label="First name" className="form-control w-25" value={newfname} onChange={(e) => setfname(e.target.value)} required />
            <input type="text" aria-label="Last name" className="form-control w-25" value={newlname} onChange={(e) => setlname(e.target.value)} required/>
            <p style={{
                                    fontFamily:'Garamond',
                                    fontSize:'20px'
                                }}>Help people discover your account by using your name. 
                                By name, we refer to the name by which you are usually called: 
                                it could be either a full name, a business name or even a 
                                nickname! </p>
        </div>
<div className="input-group mb-3">
  <span className="input-group-text" id="inputGroup-sizing-default3">Username:</span>
  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default3"
  value={newusername} onChange={(e)=>{setusername(e.target.value)}}/> 
  <p style={{
                                    fontFamily:'Garamond',
                                    fontSize:'20px'
                                }}>A username is how you are represented in the Grediiit world! 
                                But as we say, keep your username cool ... and unique!
                                In most cases, you can easily choose a username, but make sure it is
                                unique and cool !  </p>
</div>
<div className="input-group mb-3">
  <span className="input-group-text" id="inputGroup-sizing-default4">Phone Number:</span>
  <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default4"
  value={phone} onChange={(e)=>{setphone(e.target.value)}}/> 
  <p style={{
                                    fontFamily:'Garamond',
                                    fontSize:'20px'
                                }}>You can update your phone number in case you might have changed SIM or
                                got a new number. Maybe take the conversation to the phone uh huh</p>
</div>
<div className="input-group mb-3">
  <span className="input-group-text" id="inputGroup-sizing-default5">About:</span>
  <textarea type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default5"
  value={about} onChange={(e)=>{setabout(e.target.value)}}/> 
  <p style={{
                                    fontFamily:'Garamond',
                                    fontSize:'20px'
                                }}>How can someone follow you if they don't know about you? And besides you can 
                                get to know about other people also by reading their abouts! </p>
</div>
<div className="input-group mb-3">
  <span className="input-group-text" id="inputGroup-sizing-default4">Profile Image:</span>
  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default4"
  value={imageurl} onChange={(e)=>{setImageURL(e.target.value)}}/> 
  <p style={{
                                    fontFamily:'Garamond',
                                    fontSize:'20px'
                                }}>Add an HTTP based url of the image you want on your 
                                profile!  </p>
</div>
                            <button className="btn btn-outline-warning w-100" onClick={HandleEdit} style={{
                                textAlign:'center'
                            }}>Edit My Profile</button>
                            </div>
                            
                        </div>
            </div>
            <div className="col my-4 display-4 justify-content-center" id="display basic info">
                <p className="h3">{details.username}'s Stats:</p>
                {/* <Modal title={details.followers.length + " Followers"}/> 
                <Modality />& */}
                <p className="h4">&#10004; &nbsp; Member since {getDate(details.membersince)} </p> 
                
                <Modality title='Followers' list={followers} id="followers"/> 
                <Modality title='Following' list={following} id="following"/>
                {/* <Modal /> */}
            </div>
            
        </div>
        <Footer />
        </div>: navigate('/signin') 
    )
}

export default Profile