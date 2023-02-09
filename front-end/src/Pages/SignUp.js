import React from 'react' 
import DatePicker from '../Components/SignUpandIn/DatePicker'
import {useState} from 'react'
import NameInput from '../Components/SignUpandIn/NameInput'
import EmailPassword from '../Components/SignUpandIn/EmailPassword'
import UNameInput from '../Components/SignUpandIn/UserName'
import NavBar from '../Components/Navbar/NavBar'
import GenderSelect from '../Components/SignUpandIn/Gender'
import SignIn from './SignIn'
import Footer from '../Components/Footer/Footer'
import axios from 'axios' 

const getCurrentDate = ()=>{
    var today = new Date()
    var dd = today.getDate()

    var mm = today.getMonth() + 1
    var yyyy = today.getFullYear()
    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd
    return today 
}

const minDate = ()=>{
    var today = new Date()
    var dd = today.getDate()

    var mm = today.getMonth() + 1
    
    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }
    today = '1950' + '-' + mm + '-' + dd
    return today 
}

const PhonePicker =(props)=>{

    var label = props.label 
    var submitval = props.submitval 
    var submitfunc = props.submitfunc 

    return(
        <div id="phone element" className="form-floating my-4">
            <input type="number" className="number form-control" id="date" value={submitval} onChange={(e)=>submitfunc(e.target.value)} required minLength={10} maxLength={10} min={1e9} max={1e10 - 1} placeholder={1e9}/>
            <label htmlFor="date" >{label}</label>
        </div>
    )
}


const SignUp = (props)=>{



 

    // Date Of Birth  
    const label        = "Enter Your Date Of Birth: " 
    const [dob,setDOB] = useState(new Date()) 
    const currDate     = getCurrentDate()
    const minDat       = minDate() 

    // Name Input 
    const [fname,setfname] = useState('') 
    const [lname,setlname] = useState('') 

    // Email,password and confirmation 
    const [email,setEmail] = useState('') 
    const [pass,setPass]   = useState('')
    const [confpass,setConfirm] = useState('')

    // Check if account is created or not 
    const [created,setCreated] = useState(false) 

    // Make sign in page
    const [signin,setSignIn] = useState(false) 

    // username
    const [username,createName] = useState('')

    // Phone number
    const [number,createNumber] = useState(0)

    // Gender
    const [gender,SetGender] = useState('Male') 

    // List of options along with the names it is taking
    const listofmenu = [
        {
            title:'Home',
            href:'/',
        },
       

    ]
    const title = "Sign Up" 

    // Check if we can submit the button or not
    // this is important for the checking of info 
    // If needed, we can update it later but for now, 
    // we can assume it just works 
    const checkvalidity = ()=>{
        return fname.length === 0 || lname.length === 0 || email.includes('@') === false || pass.length === 0 || confpass === 0 
    }

    // Handler function for the time when the button is first pressed 
    // by the user for the initial account creation 
    // check if the user has correctly given the input or not 
    const submithandler = (e)=>{
        e.preventDefault() 
        if(pass !== confpass)
        {
            alert("ALERT: PASSWORD AND CONFIRM PASSWORD DOES NOT MATCH") 
            return
        }

        axios.post('http://localhost:4000/signin/verify',{
            email:email
        }).then((res)=>{
            console.log("response: ",res) 
            if(res.data.result != null)
            {
                if(res.data.result === false)
                {
                    setCreated(false) 
                    alert("ALERT: An Account With This Email Already Exists. Please choose a different email")
                    return 
                }
                else 
                {
                    setCreated(true) 
                }
            }
            else
            {
                alert("Error")
                return 
            }
        }).catch((err)=>{
            console.log("Error due to some issues")
            alert("Error due to internal, please try again")
        })

    }

    var HandleSignUp = (e)=>{
        e.preventDefault()

        var confirmation = window.confirm("Are you sure you want to keep this username?")
        if(confirmation === false)
        {
            return 
        }

        axios.post('http://localhost:4000/signin/create',{
            name:{
                firstname:fname,
                lastname:lname,
            }, 
            gender:gender, 
            dob:dob, 
            phone:number, 
            email:email, 
            password:pass, 
            username:username 
        }).then((res)=>{ 
            console.log("response recieved",res.data.message) 
            if(res.data.message === null)
            {
                alert("ALERT: Unexpected Error during transaction !!!") 
                return 
            }
            else if(res.data.message === false)
            {
                alert("ALERT: Choose a different username! This one already exists !!!") 
                return 
            }
            else 
            {
                alert("SUCCESS: Your account has been created! You will be redirected to the Sign In Page shortly...")
                setSignIn(true) 
                return 
            }
        }).catch((err)=>{
            console.log("Error sending data")
            console.log(err) 
        })
        
        setSignIn(true) 
        return 
    }

    const mydiv = {
    backgroundImage:`url('https://png.pngtree.com/thumb_back/fh260/background/20191219/pngtree-dark-blue-cool-background-image_325309.jpg')`,
    backgroundRepeat:'no-repeat',
    backgroundSize:'cover',
    alignContent:'center'
}
    const formstyle = {
        backgroundImage:`url('https://miro.medium.com/max/1400/1*Botc02OEsqDHA026jiYV5A.png')`,
        backgroundRepeat:'no-repeat',
    backgroundSize:'cover',
    alignContent:'center',
    textAlign:'center',
    }
    return(
        created === false  && signin === false? 
        <div className='App' style={mydiv}>
            <NavBar isdropdown={false} issearch={false} listofmenu={listofmenu} title={title} black={true}/>
        <div className='container-fluid' onSubmit={submithandler}> 
            {console.log("signin",signin,"created",created)}
            <div class="row justify-content-center align-items-center ">
            
            <form className="w-50 needs-validation my-5" style={formstyle}>
            <h3 className='display-6 my-4'>Welcome To Sign Up Page! &#128522;</h3>
            <h5 >A place to share knowledge and better understand the world...
            <br></br>
            A place to connect and share with people in your life... 
            <br></br>Come join this community today!</h5>
            <NameInput fname={fname} lname={lname} setfname={setfname} setlname={setlname} label={"Enter Your First and Last Name: "}/>
            <div className='row'>
            <div className="col">
            <DatePicker submitval={dob} updatefunc={setDOB} label={label} maxdate={currDate} mindate={minDat}/> 
            </div>
            <div className='col'>
            <PhonePicker submitval={number} submitfunc={createNumber} label={"Enter Your Phone Number: "}/>
            </div>
            <GenderSelect gender={gender} setgender={SetGender}/>
            </div>
            <EmailPassword emailID={email} setemail={setEmail} password={pass} setPassword={setPass} confirmpass={confpass} setConfirm={setConfirm} needconf = {true} tag={"Enter The Email:"}/>
            
            <div class="row justify-content-center align-items-center">
            {
                checkvalidity() === true ?
                <button type="submit" className="btn btn-outline-black w-50" disabled>Submit</button>
                :
                <button type="submit" className="btn btn-success w-50">Submit</button>
            }
            </div>
            <br></br><br></br>
            </form>
            <div class="row justify-content-center align-items-center">
            <button className='btn btn-danger w-50 my-4' onClick={()=>{setSignIn(true)}}>Click Here If You Already Have An Account</button></div>
            </div>
            <Footer />
        </div>

        </div>
        : signin === false ? 
        <div className='App' style={mydiv}>
            <NavBar isdropdown={false} issearch={false} listofmenu={listofmenu} title={title} variable={signin} func={setSignIn} black={true}/>
        <div className='container-fluid'>
        <div class="row justify-content-center align-items-center ">
        <form className="w-50 needs-validation my-5" style={formstyle} onSubmit={HandleSignUp}>
            <h3 className='display-6' style={{alignContent:'center'}}>Welcome To Sign Up Page! &#128522;</h3>
            <h5 style={{fontStyle:'italic'}} >Congratulations for creating an account!
            <br></br>
            The next step is to decide the name by which the community will recognize you... a username! 
            <br></br>
            Select a username and enter it below. And then... you are good to go! 
            </h5>
            
                <UNameInput fname={username} setfname={createName} label={"Enter A Username: "}/>
            
            <br></br>
            <h5 style={{fontStyle:'italic'}} className='my-4'>
                After creating a username, press the Enter Button and then... you are done! 
            </h5>
            <h5 className='' style={{textAlign:'center'}}><u>By signing up, you agree to our Terms, Privacy Policy and <br></br>Cookies Policy.</u></h5>
        </form>
        </div>
        </div>
        <Footer />
        </div>
        : 
        <SignIn />
    )
}


export default SignUp