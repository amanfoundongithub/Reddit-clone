import React from "react"

const EmailPassword = (props)=>{

    var emailID = props.emailID
    var setIDMail = props.setemail 

    var tag = props.tag 

    var password = props.password
    var setPassword = props.setPassword

    if(props.needconf)
    {
    var confirmpass = props.confirmpass 
    var setConfirm  = props.setConfirm }


    return(
        <div className="container">
            <div className="form-floating my-4">
                {/* <span className="input-group-text" id="email">Enter Your Email ID: </span> */}
                { tag === "Enter The Username:" ?
                <input type="text" id="lol" className="form-control" placeholder="example@abc.com" aria-label="Username" aria-describedby="basic-addon1" value={emailID} onChange={(e) => setIDMail(e.target.value)} required name="username"/>
            : <input type="email" id="lol" className="form-control" placeholder="example@abc.com" aria-label="Username" aria-describedby="basic-addon1" value={emailID} onChange={(e) => setIDMail(e.target.value)} required name="email"/>}
            <label htmlFor="lol">{tag}</label>
            </div>
            <div className="form-floating my-4">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Your Password" value={password} onChange={(e) => { setPassword(e.target.value) }} required name="password"/>

                <label htmlFor="floatingPassword">Enter Your Password Here</label>
            </div>
            {props.needconf === true ? 
            <div className="form-floating my-4">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Confirm Password" value={confirmpass} onChange={(e) => { setConfirm(e.target.value) }} required name="confirmpassword"/>

            <label htmlFor="floatingPassword">Confirm Your Password Here</label>
        </div>: ""
            }
            
        </div>
    )
}

export default EmailPassword 