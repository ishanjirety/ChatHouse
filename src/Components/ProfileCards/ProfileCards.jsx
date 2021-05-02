import React from 'react'
import './Assets/css/ProfileCards.css'

export function ProfileCards(props) {
    const { data,state } = props
    const {avatar,groupName,status,id} = data
    console.log(id)
    return (
        <div className="profile-card" onClick={()=>state({type:"SELECT-USER",payload:data})}>
                <img className="profile-picture" alt="" src={avatar} ></img>
            <div className="chat-info">
                <h3>{groupName}</h3>
                <small>How are you</small>
            </div>
            <div className="time-stamp" >
                <small >2:18 PM</small>
                <span className="notification"> 9+ </span>
            </div>
        </div>
    )
}
