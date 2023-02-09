import React from 'react'


const DatePicker = (props)=>{


    var submitfunc = props.updatefunc 
    var submitval  = props.updateval 
    var label      = props.label 
    var maxdate    = props.maxdate 
    var mindate    = props.mindate 


    return(
        <div id="date element" className="form-floating my-4">
            <input type="date" className="date form-control" id="date" value={submitval} onChange={(e)=>submitfunc(e.target.value)} max={maxdate} min={mindate} required/>
            <label htmlFor="date" >{label}</label>
        </div>
    )
}

export default DatePicker 