import React, { useEffect , useState} from "react"
import NavBar from "../Components/Navbar/NavBar"
import { useNavigate  } from "react-router-dom"
import axios from 'axios' 

const getDate = (date)=>{
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date(date);
    return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}


const Modal = ()=>{

    // Control variables 
    const [name,setName] = useState('') 
    const [desc,setDesc] = useState('') 
    const [tags,setTags] = useState([]) 
    const [ban,setBan] = useState([])

    

    const HandleSubmit = ()=>{
        let cute=  name.trim()
        let cute2 = desc.trim()
        axios.post('http://localhost:4000/api/gr/create',{
            token:'BEARER '+ window.localStorage.getItem('myaccesstoken'),
            name:cute, 
            desc:cute2, 
            tags:tags, 
            ban:ban,
        }).then((res)=>{
            if(res.data.created === 'YES')
            {
                alert("Your SubGreddiit has been created!")
                window.location.reload() 
            }
            else if(res.data.created === 'NO')
            {
                alert('Please choose a different name! This one already exists!!!')
                return 
            }
            else 
            {
                alert("ERROR WHILE CREATING GREDIIT! TRY AGAIN!!!")
                return 
            }
        }).catch((err)=>{
            console.log("Error in AXIOS: ",err) 
        })
    }

    const HandleTags = (e)=>{
        setTags(e.target.value.split(' '))
        
        for(let i = 0 ; i < tags.length ; i++)
        {
            tags[i] = tags[i].trim() 
        }

    }

    const HandleBan = (e)=>{
        setBan(e.target.value.split(' '))
        
        for(let i = 0 ; i < ban.length ; i++)
        {
            ban[i] = ban[i].trim() 
        }

    }
    return(
        <div>
<button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  + Add New Greddiit
</button>

<div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel">Create Your Own SubGreddiit!</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <p className="display-6" style={{
            fontFamily:'Times',
            fontSize:'20px'
        }}>So, you have decided to create a SubGreddiit! Enter the details of the SubGreddiit below to continue:</p>
        <form onSubmit={()=>{HandleSubmit()}}>
        <div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">Name :</span>
  <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value={name} onChange={(e)=>{setName(e.target.value)}}/>
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">Description [Optional]:</span>
  <textarea type="text" class="form-control" placeholder="Description" aria-label="Username" aria-describedby="basic-addon1" value={desc} onChange={(e)=>{setDesc(e.target.value)}}/>
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">Tags [seperated by space]:</span>
  <input type="text" class="form-control" placeholder="Tags" aria-label="Username" aria-describedby="basic-addon1"  onChange={(e)=>{HandleTags(e)}}/>
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">Banned Keywords [seperated by space]:</span>
  <input type="text" class="form-control" placeholder="Banned Keywords" aria-label="Username" aria-describedby="basic-addon1"  onChange={(e)=>{HandleBan(e)}}/>
</div>
 <button type='submit' className="btn btn-warning">CONFIRM</button>
        </form>
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

const MySubGreddits = ()=>{
    const [loaded,setLoaded] = useState(false) 
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
    })  

    const [arr,setArr] = useState([])

    function changedata(e){
        setDetails(e) 
        
        // Now set an axios request to get the usernames
        axios.post('http://localhost:4000/api/gr/get',{
            list:e.created, 
        }).then((res)=>{
            setArr(res.data.list) 
            setLoaded(true) 
        }).catch((err)=>{
            console.log("Error") 
        })

    }

    if(details.email === '')
    {
    axios.post('http://localhost:4000/api/userdata/profile',{
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
        axios.post('http://localhost:4000/api/gr/delete',{
            name:username, 
        }).then((res)=>{
            window.location.reload() 
            console.log(res.data) 
        }).catch((err)=>{
            console.log("AXIOS ERROR")
        })

    }

    


    return(
        loaded === true ?
        <div className="container-fluid">
            <NavBar listofmenu = {listofmenu} isdropdown={false} issearch={false} />
            <div className="row">
            <div className="col my-4 justify-content-center text-center">
                <img src={details.imageurl} className="rounded-circle" width="300" height="300" alt="Profile"/>
            </div>
            <div className="col my-4 display-6 justify-content-center" id="display basic info">
            {
                details.username 
            }'s SubGreddiits

            {
                arr.length === 0 ? 
                <p className="h3">You have not yet created a SubGreddiit yet!</p>
                :
                arr.map((e)=>{
                    return(
                        <div>
                            <br></br>
                        <div className="col">
                            <img src={e.image} width='50' height='50' className="rounded-circle"></img>&nbsp;
                            <a href={'/gr/' + e.name} style={{
                                textDecoration:'none'
                            }}>{e.name}</a>
                            <h5>{e.desc}</h5>
                            
                            <p className="h6">Created On     : {getDate(e.createdate)}</p>
                            <p className="h6">Followers      : {e.followers}</p>
                            <p className="h6">Moderators     : {e.moderators}</p>
                            <p className="h6">Posts          : {e.posts}</p>
                            <p className="h6">Banned Keywords: {e.bannedKeywords.join(' ,')}</p>
                            <button className="btn btn-outline-danger" onClick={()=>{
                                HandleDelete(e.name) 
                            }}>Delete This SubGreddiit</button>
                        </div>
                        
                        </div>
                    )
                })
            }
            <br></br>
            <Modal />
            </div>

            </div>
        </div>
        :
        <div className="justify-content-center align-text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p>Loading Your SubGreddiits, please wait...</p>
        </div>
    )
}

export default MySubGreddits