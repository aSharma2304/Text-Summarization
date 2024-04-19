import React from 'react'

const Button = (props) => {
 
  return (
    <div>
        <button className="btn btn-outline btn-secondary" onClick={props.action}>{props.name}</button>
    </div>
  )
}
export default Button
