import axios from "axios"
import React, { useState } from "react"
import NavBar from "../Components/Navbar/NavBar"
import searchit from '../Components/Images/search.png'



const HomePage = ()=>{

    // searched word to be on the MongoDB 
    const [search,setSearch] = useState('')

    // Search list of the MongoDB 
    const [list,setList] = useState([])

    const HandleInput = ()=>{
        
        axios.post('http://localhost:4000/gr/search',{
            search:search,
        }).then((res)=>{
            setList(res.data.list) 
            
        }).catch((err)=>{
            console.log("AXIOS ERROR")

        })
    }

   

    // FOR NAVBAR PARAMETER ARE DISPLAYED HERE
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

    ]

    return(
        <div className="container-fluid justify-content-center" style={{
            alignContent:'center',
            textAlign:'center'
        }}>
            <NavBar listofmenu = {listofmenu} isdropdown={false} issearch={false} />
            <p className="display-5" style={{
                textAlign:'center'
            }}>
                Welcome To Official Greddiit Page! <br></br>&#128591;
            </p>
            <br></br>
            
            <div class="input-group mb-3 w-50" style={{
                alignContent:'center',
                textAlign:'center'
            }}>
  {/* <span class="input-group-text" id="basic-addon1">Name :</span> */}
  <input type="text" class="form-control" placeholder="Search something here..." aria-label="Username" aria-describedby="basic-addon1" value={search} onChange={(e)=>{setSearch(e.target.value);
            HandleInput();}}/>
    <button className="btn btn-outline-info">
        <img src={searchit} width='20' height='20'/>
    </button>
    
</div>
            {
                
                <div>
                    {
                        list.map((val,index)=>{
                            return(
                                <div id={index}>
                                    <img src={val.profileImageURL} width='30' height='30' className="rounded-circle"></img>
                                    &nbsp;
                                    <a href={'/gr/' + val.name} style={{
                                textDecoration:'none',
                                color:'black' 
                            }}>{val.name}</a>
                                </div>
                            )
                        })
                    }
                </div>
                
            }
        </div>
    )
}

export default HomePage