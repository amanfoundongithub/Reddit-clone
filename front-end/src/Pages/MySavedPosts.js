import React, { useEffect , useState} from "react"
import NavBar from "../Components/Navbar/NavBar"
import { useNavigate  } from "react-router-dom"
import axios from 'axios' 
import Post from '../Components/Page/Post'

const getDate = (date)=>{
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date(date);
    return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}


/*
This component is aimed to display the Saved Posts By a User 
*/
const MySavedOnes = ()=>{

    const navigate = useNavigate() 

    useEffect(()=>{
        console.log("username: ",window.localStorage.getItem("current-username")) 
        if(window.localStorage.getItem("current-username") !== 'yes')
        {
            navigate('/signin')
            // window.location.reload() 
        }
    })

    // List of menu 
    const listofmenu = [
        {
            title: 'Home',
            href:'/',
        },
        {
            title:'Logout',
            href:'/signin',
        },
        {
            title: 'Profile',
            href:'/profile',
        },
        {
            title:'My SubGreddiits',
            href:'/mysg'
        }

    ]

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
        created:[],
        followed:[],
        savedPosts:[],
    })  

    const [arr,setArr] = useState([])
    const [det,setDet] = useState([]) 

    
    function changedata(e){
        setDetails(e) 

        // Now set an axios request to get the usernames
    
        axios.post('http://localhost:4000/post/bookmarkit',{
            list:e.savedPosts, 
            lol:true,
        }).then((res)=>{
            console.log("res.data.list: ",res.data.list) 
            setDet(res.data.list)
            setArr(res.data.list) 
        
        }).catch((err)=>{
            console.log("Error") 
        })

    }

    if(details.email === '')
    {
    axios.post('http://localhost:4000/userdata/profile',{
        id:window.localStorage.getItem('current-username'),
        token:"BEARER "+window.localStorage.getItem('myaccesstoken')
    }).then((res)=>{
        if(res.data.message)
        {
            changedata(res.data.message) 
        }
    }).catch((err)=>{
        console.log("ERROR IN AXIOS REQUEST")
        console.log(err)
    })
}
    
    const HandleDelete = (username)=>{
        let output = window.confirm('Are you sure you really want to delete this SubGreddiit?')

        if(output === false)
        {
            return 
        }
        axios.post('http://localhost:4000/gr/delete',{
            name:username, 
        }).then((res)=>{
            window.location.reload() 
            console.log(res.data) 
        }).catch((err)=>{
            console.log("AXIOS ERROR")
        })

    }

    console.log("details: ",details) 


    return(
        <div className="container-fluid">
            <NavBar listofmenu = {listofmenu} isdropdown={false} issearch={false} />
            <div className="row">
            <div className="col my-4 justify-content-center text-center">
                <img src={details.imageurl} className="rounded-circle" width="300" height="300" alt="Profile"/>
            </div>
            <div className="col my-4 justify-content-center" id="display basic info">
                <p className="display-6">
                {
                details.username 
            }'s Saved Posts 
                </p>
            {
                console.log("Det: ,Arr:",det,arr) 
            }
            
            {

                arr.length === 0 ? 
                <p className="h3">No Bookmarked Posts yet!</p>
                :
                arr.map((e,index)=>{
                   
                    return(
                        
                        <div>
                            {
                                console.log("data: ",det[index]) 
                            }
                            <Post data={det[index]} current={details.email} arr={details.savedPosts} tim={false} discomment={false} name={det[index].name}
                            show ={true}/>
                        </div>
                    )
                })
            }
            <br></br>
            </div>

            </div>
        </div>
    )
}

export default MySavedOnes