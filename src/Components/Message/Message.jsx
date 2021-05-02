import React,{useEffect,useState} from 'react'
import './Assets/css/Message.css'
import firebase from 'firebase/app'
import 'firebase/firestore'



const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain:process.env.REACT_APP_authDomain,
    projectId:process.env.REACT_APP_projectId,
    storageBucket:process.env.REACT_APP_storageBucket,
    messagingSenderId:process.env.REACT_APP_messagingSenderId,
    appId:process.env.REACT_APP_appId,
    measurementId:process.env.REACT_APP_measurementId,
  };
  
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
  }
  const firestore = firebase.firestore()

export function Message(props) {
    const [avatar,setAvatar] = useState("")
    const [username,setUsername] = useState("")
    const {data,user} = props
    const {sentBy,message,id} = data
    useEffect(async ()=>{
        console.log(id)
        const userData = await firestore.collection('users').doc(sentBy).get()
        setUsername(userData.data().username)
        setAvatar(userData.data().avatar)
    },[])
    return (
        <>
        {sentBy!==user ? <div className="message">
        <small className="user-name">{username}</small>
           <img src={avatar} className="profile-picture"></img> <div className="opposition">
               <p>{message}</p><small>{data.createdAt.toDate().toLocaleTimeString('en-US')}</small>
            </div>
            
        </div>:
        <div className="message opposition-message">
        <div className="sender">
            <p>{message}</p> <small>{data.createdAt.toDate().toLocaleTimeString('en-US')}</small></div>
            <img src={avatar} className="profile-picture"></img> 
     </div>}
     </>
    )
}


// https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940