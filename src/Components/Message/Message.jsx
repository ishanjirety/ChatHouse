import React from 'react'
import './Assets/css/Message.css'

export function Message(props) {
    const {data,user} = props
    const {sentBy,message,id} = data
    console.log(`sentBy->${message}`,sentBy,`user->${message}`,user)
    return (
        <>
        {sentBy!==user ? <div className="message">
           <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" className="profile-picture"></img> <div className="opposition">
               <p>{message}</p><small>2:01 PM</small>
            </div>
        </div>:
        <div className="message opposition-message">
        <div className="sender">
            <p>{message}</p> <small>2:01 PM</small></div>
            <img src="https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" className="profile-picture"></img> 
     </div>}
     </>
    )
}


// https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940