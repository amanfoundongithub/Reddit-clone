import React from "react"


const UNameInput = (props)=>{

    var fname = props.fname 

    var setfname = props.setfname 

    var label = props.label 
    return(
        <div id="text" className="input-group my-3" >
            <span className="input-group-text">{label}</span>
            <input type="text" aria-label="First name" className="form-control" value={fname} onChange={(e) => setfname(e.target.value)} required/>
            
        </div>
    )
}

export default UNameInput 