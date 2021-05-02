import React,{useEffect,useState,useReducer} from 'react'
import { Nav,Chatlist } from '../Components'
import './Assets/css/Page.css'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { getToken } from '../Token/Token'

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

export function Notifications() {
    const { email } = getToken()
    const [userId,setUserId] = useState()
    const [notification,notificationDispatch] = useReducer(notificationReducer,{notification:[],profiles:[]})

    useEffect(async ()=>{
        const users = firestore.collection('users').onSnapshot(querySnapshot=>querySnapshot.docs.map(doc => {
            if(doc.data().email === email ){
                console.log("updated 123")
                setUserId(doc.id)
                return notificationDispatch({type:"ADD-NOTIFICATION", payload:doc.data().notification})
            }
        }))
        
    },[firestore])
    useEffect(async ()=>{
        try{
            console.log(notification.notification)
        notification.notification.map(async (id)=>{
            console.log(id)
           let user = await firestore.collection('users').doc(id.userId).get()
           notificationDispatch({type:"ADD-PROFILES",payload:{avatar: user.data().avatar,username:user.data().username,id:user.id}})
            }
            
        )
        }catch(e){
            console.log(e)
        }
    },[notification.notification])
    return (
        <div className="page-wrapper">
             <Nav />
             <div className="chat-list">
             {notification.profiles.map((profile,key)=>{
                 console.log(profile)
              return ( 
                <NotificationCard profile={profile} userId ={userId} notification={notification.notification[key]} dispatch={notificationDispatch}/>
              )
             })}
             </div>
        </div>
    )
}
function notificationReducer(state,action){
    switch(action.type){
            case "ADD-NOTIFICATION":
                console.log(action.payload)
                    return {...state,notification:action.payload}
            case "ADD-PROFILES":
                console.log(action.payload)
                if(!state.profiles.find(profile => profile.username === action.payload.username)){
                    return {...state,profiles:[...state.profiles,action.payload]}
                }
                return state
            default:
                return state;
        
    }
}

function NotificationCard(props){
    const {profile,userId,notification,dispatch} = props
    
    async function AcceptHandler(){
       console.log(notification) 
        const user = await firestore.collection('users').doc(profile.id).get()
        
        const permissions = [...user.data().permissions,{groupId:notification.groupId,access:true}]
        await firestore.collection('users').doc(profile.id).update({permissions:permissions})

        const adminUser = await firestore.collection('users').doc(userId).get()
        const newNotifications = adminUser.data().notification.filter(alert => alert.userId !== profile.id && alert.groupId !== notification.groupId)
        await firestore.collection('users').doc(userId).update({notification:newNotifications})
    }
    async function declineHandler(){        
        const adminUser = await firestore.collection('users').doc(userId).get()
        const newNotifications = adminUser.data().notification.filter(alert => alert.userId !== profile.id && alert.groupId !== notification.groupId)
        await firestore.collection('users').doc(userId).update({notification:newNotifications})
    }

    return (<div className="profile-card">
                    <img className="profile-picture" alt="" src={profile.avatar} ></img>
                <div className="chat-info">
                    <h3>{profile.username}</h3>
                </div>
                <div className="time-stamp action" >
                    <button className="accept" onClick={AcceptHandler}>
                    <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" ></path></svg>
                    </button>
                    <button className="reject" onClick={declineHandler}>
                    <svg viewBox="0 0 15 15"><g fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687L4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5l3.469-3.468z"></path></g></svg>
                    </button>
                </div>
            </div>)
}