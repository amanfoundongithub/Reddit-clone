import React, { useEffect } from 'react' 
import { useState } from 'react'
import EmailPassword from '../Components/SignUpandIn/EmailPassword'
import { useNavigate } from 'react-router-dom'
import NavBar from '../Components/Navbar/NavBar'
import SignUp from './SignUp'
import Footer from '../Components/Footer/Footer'
import axios from 'axios'

const SignIn = (props)=>{



    window.localStorage.setItem("admin","useremail@gmail.com")
    window.localStorage.setItem("adminfname","Admin")
    window.localStorage.setItem("adminlname","Stuff")
    window.localStorage.setItem("admingender","Female")
    window.localStorage.setItem("admindob","2004-06-07")
    window.localStorage.setItem("adminpassword","admin")
    window.localStorage.setItem("adminsince","2023-01-20")
    window.localStorage.setItem("adminnumber","1234567890")

    
    const [email,setEmail] = useState('') 
    const [pass,setPass]   = useState('')

    const [variable,functional] = useState(true) 
    
    const navigate = useNavigate() 

    useEffect(()=>{
        console.log("username in signin page: ",window.localStorage.getItem("current-username")) 
        if(window.localStorage.getItem("current-username") != null) 
        {
            navigate('/profile') 
            // window.location.reload() 
        }
    })

    // Checks if the current input provided is valid or not 
    var checkvalidity = ()=>{
        return email.length === 0 || pass.length === 0
    }

    // For the navbar 
    const title = "Sign In"
    
    const listofmenu = [
        {
            title:'Home',
            href:'/',
        },
    ]

    // Handles submission after the Sign In is tried to be done 
    var HandleSignIn = (e)=>{

    
        e.preventDefault()


        // Send data via axios to verify and get the id of the person 
        axios.post('http://localhost:4000/signin/signin',{
            username:email,
            password:pass, 
        }).then((res)=>{
            const recieved = res.data.message

            console.log("response from the server: ",res) 
            if(recieved === null)
            {
                alert("ALERT : Either the username or the password is incorrect! Please try again !!!")
                return 
            }
            else if(recieved === undefined)
            {
                alert("ALERT : Database failure error. Try again after a few moments...")
                return 
            }

            // Now alert 
            window.localStorage.setItem("myaccesstoken",res.data.accesstoken)
            window.localStorage.setItem("current-username","yes")   
            navigate('/profile') 
            console.log("Success")
        }).catch((err)=>{
            console.log("Error sending data")
            console.log(err) 
        })
        
        return 
    }

    const formstyle = {
        backgroundImage:`url('https://miro.medium.com/max/1400/1*Botc02OEsqDHA026jiYV5A.png')`,
        backgroundRepeat:'no-repeat',
    backgroundSize:'cover',
    alignContent:'center',
    textAlign:'center'
    }

    return(

        variable === true ?
        <div className='App' style={{backgroundImage:`url('https://png.pngtree.com/thumb_back/fh260/background/20191219/pngtree-dark-blue-cool-background-image_325309.jpg')`,backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>
             <NavBar isdropdown={false} issearch={false} listofmenu={listofmenu} title={title} variable={variable} func={functional} black={true}/>
        <div className='container-fluid' >
            <div className="row justify-content-center align-items-center">
            <form className="w-50 needs-validation my-5" style={formstyle} onSubmit={HandleSignIn} method='POST'>
            <h3 className='display-6 my-4'>Glad You Are Back! &#128522;</h3>
            <h5 style={{fontStyle:'italic'}}>But... before we start, let's make sure its really you...</h5>
            <EmailPassword emailID={email} setemail={setEmail} password={pass} setPassword={setPass} needconf={false} tag={"Enter The Username:"}/>
            <h5 className='' style={{textAlign:'center'}}><u>By signing up, you agree to our Terms, Privacy Policy and <br></br>Cookies Policy.</u></h5>
            <div class="row justify-content-center align-items-center">
            {
                checkvalidity() === true ?
                <button type="submit" className="btn btn-outline-info w-50" disabled>Submit</button>
                :
                <button type="submit" className="btn btn-success w-50">Submit</button>
            }
            </div>
            <br></br><br></br>
            </form>
            <div className="row justify-content-center align-items-center">
            <button className='btn btn-danger w-50 my-4' onClick={()=>{functional(false)}}>Click Here If You Don't Have An Account</button>
            </div>
            </div>
        </div>
        <Footer/>
        </div>
        :
        <SignUp />
    )
}

export default SignIn