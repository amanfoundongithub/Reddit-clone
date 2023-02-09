import React from "react"


const NameInput = (props)=>{

    var fname = props.fname 
    var lname = props.lname 

    var setfname = props.setfname 
    var setlname = props.setlname 

    var label = props.label 
    return(
        <div id="text" className="input-group my-3" >
            <span className="input-group-text">{label}</span>
            <input type="text" aria-label="First name" className="form-control w-25" value={fname} onChange={(e) => setfname(e.target.value)} required />
            <input type="text" aria-label="Last name" className="form-control w-25" value={lname} onChange={(e) => setlname(e.target.value)} required/>
        </div>
    )
}

export default NameInput 