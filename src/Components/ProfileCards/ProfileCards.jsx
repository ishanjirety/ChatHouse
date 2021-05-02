import React,{useState,useEffect} from 'react'
import './Assets/css/ProfileCards.css'
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


export function ProfileCards(props) {
    const { data,state } = props
    const {avatar,groupName,status,id} = data
    const [lastMessage,setLastmessage] = useState("")
    useEffect(async () => {
        firestore.collection('Groups').doc(id).collection('messages').orderBy('createdAt').limit(100).onSnapshot(querySnapshot=>{
        querySnapshot.docs.map(docs => {return docs.data() && setLastmessage({message:docs.data().message,sentBy:docs.data().sentBy,timeStamp:docs.data().createdAt}
            )})
        })
        console.log(lastMessage.timeStamp?.toDate().toLocaleTimeString('en-US'))
    }, [firestore])
    console.log(lastMessage)
    return (
        <div className="profile-card" onClick={()=>state({type:"SELECT-USER",payload:data})}>
                <img className="profile-picture" alt="" src={avatar} ></img>
            <div className="chat-info">
                <h3>{groupName}</h3>
                <small>{lastMessage.message}</small>
            </div>
            <div className="time-stamp" >
                <small >{lastMessage.timeStamp?.toDate().toLocaleTimeString('en-US')}</small>
            </div>
        </div>
    )
}
