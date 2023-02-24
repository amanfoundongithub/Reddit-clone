import React from "react"
import logo from '../Images/logo.png'
import { useNavigate } from "react-router-dom"

// Icons
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

const LogOut = ()=>{
  // console.log("The bytton is pressed")
  window.localStorage.removeItem('current-username') 
  const navigate = useNavigate();

  navigate('/signin') 
}



const NavBar = (props)=>{

    var title = props.title 
    var title = "Greddiit"

    var listofmenu = props.listofmenu 

    var colorchoose = props.black === true ? "white" : "black" 
    // console.log("colorchoose",colorchoose)  
    // each item has a href and a title 

    var isdropdown = props.isdropdown 

    var stile = {
      color:colorchoose,
    }

    var listoficons = []

    for(let i = 0 ; i < listofmenu.length ; i++)
    {
      let tag = listofmenu[i] 

      if(tag.title === 'Home')
      {
          listoficons.push('home') 
      }
      
    }


    return(
      <nav className="navbar navbar-expand-lg" >
      <div className="container-fluid">
        <img src={logo} width="60" height="60" alt={"Reed logo"}/>
        <a className="navbar-brand" style={stile}> {title}</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={stile}>
            {listofmenu.map((item,index)=>{
              if(item.title === 'Logout')
              {
                return <li className="nav-item">
                  
                <a className="nav-link active" aria-current="page" href={item.href} onClick={LogOut} style={stile}><LogoutIcon /> {item.title}</a>
              </li>
              }
              
              return(
                <li className="nav-item">
                  
              <a className="nav-link active" aria-current="page" href={item.href} style={stile}>
              {
                  item.title === 'Home'? 
                  <HomeIcon />
                  :
                  item.title === 'Profile' ?
                  <AccountCircleIcon />
                  :
                  item.title === 'My Saved Posts'?
                  <MailOutlineOutlinedIcon />
                  :
                  item.title === 'My SubGreddiits' ?
                  <PeopleAltOutlinedIcon />
                  :
                  item.title === 'Log In' ?
                  <LoginOutlinedIcon />
                  :
                  ""
                }
                {item.title}</a>
            </li>
              )
            })}
            {isdropdown === true ?
            <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={stile}>
              {props.dropdowntitle}
            </a>
            <ul className="dropdown-menu">
              {props.dropdownlist.map((element,i)=>{
                if(element.title === 'Logout')
                {
                  // console.log("please enter here bsdk")
                  return (<li><a className="dropdown-item" key={i} href={element.href} onClick={()=>LogOut} style={stile}>{element.title}</a></li>)
                }
                return <li><a className="dropdown-item" key={i} href={element.href} style={stile}>{element.title}</a></li>
              })}
            </ul>
          </li> 
            : ""
            }
          </ul>
          {props.issearch === true ? 
           <form className="d-flex" role="search">
           <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"value={props.searchval} onChange={(e)=>{props.func(e.target.value)}}/>
           <button className="btn btn-outline-success" type="submit">{props.searchtitle}</button>
         </form>
          : ""
          }
        </div>
      </div>
    </nav>
    )
}



export default NavBar 