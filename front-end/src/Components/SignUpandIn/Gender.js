import React from "react"


const GenderSelect = (props)=>{

    var gender = props.gender 

    var setGender = props.setgender 


    return(
        <div className="input-group mb-3 my-4">
        <label className="input-group-text" htmlFor="inputGroupSelect01">Your Gender: </label>
  <select className="form-select" id="inputGroupSelect01" value={gender} onChange={(e)=>{setGender(e.target.value)}}>
    <option selected value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Transgender">Transgender</option>
    <option value="Rather not say">Rather not say</option>
    {console.log(gender)} 
  </select>
  </div>
    )
}

export default GenderSelect 