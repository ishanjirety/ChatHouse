import React,{useState,useEffect,useReducer} from 'react'
import './Assets/css/Chatlist.css'
import './Assets/css/ChatListResponsive.css'
import uuid from 'react-uuid'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { ProfileCards } from '../ProfileCards/ProfileCards'
import { Link } from 'react-router-dom'
import logo from '../../Logo/Logo.svg'
import { Message } from '../Message/Message'
import firebase from 'firebase/app'
import 'firebase/firestore'
import {getToken} from '../../Token/Token'

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

export function Chatlist() {
    const [chatlist,chatlistDispatch] = useReducer(chatlistDispatcher,{emojipicker:false,userInfo:"",users:[],selectedUser:"",groupName:"",agenda:"",messages:[]})
    const [messageinput,setMessageInput] = useState("")
    const [openModal,setOpenModal] = useState(false)
    const {email} = getToken()
    useEffect(() => {
        (async function updateMessage(){
        const collection = firestore.collection('users')
        const users = await collection.get()
        users.docs.map(doc => doc.data().email === email && chatlistDispatch({type:"USER-INFO", payload:{...doc.data(),id:doc.id}}))
        // users.docs.map((doc,key) => {
        //     chatlistDispatch({type:"UPDATE-USER", payload:{...doc.data(),id:doc.id}})
        // })
        const groups = await firestore.collection('Groups').get()
        groups.docs.map(docs=> chatlistDispatch({type:"UPDATE-USER",payload:{...docs.data(),id:docs.id}}))
        return users
        })()
      }, [])
      
      useEffect(async ()=>{
          if(chatlist.selectedUser){
            chatlistDispatch({type:"EMPTY-MESSAGE"})
            firestore.collection('Groups').doc(chatlist.selectedUser.id).collection("messages").orderBy('createdAt').limit(100).onSnapshot(querySnapshot=>querySnapshot.docs.map(doc => chatlistDispatch({type:"ADD-MESSAGE",payload:{...doc.data(),id:doc.id}}) ))
          }
    },[firestore,chatlist.selectedUser])

      async function sendMessage(){
            await firestore.collection('Groups').doc(chatlist.selectedUser.id).collection('messages').add({
                message:messageinput,
                createdAt:new Date(),
                sentBy:chatlist.userInfo.id
            })
            setMessageInput("")
      }
      async function createGroup(){
        const group = await firestore.collection('Groups').add({
            groupName:chatlist.groupName,
            agenda:chatlist.agenda,
            createdAt : new Date(),
            admin : chatlist.userInfo.id,
            joinedUsers : [],
            requests : [],
            status : "public"
        })
        const getUser = await firestore.collection('users').doc(chatlist.userInfo.id).get()
        const updateUser = await firestore.collection('users').doc(chatlist.userInfo.id).update({activeGroups:[...getUser.data().activeGroups,group.id]})
        const collectionRef =firestore.collection('Groups').doc(group.id).collection('messages')
        await collectionRef.add({})
        setOpenModal(false)
      }


    return (
        <div className="chat-list">
            <div className="logo-header">
                <img src={logo}></img>
                    <button className="create-group" onClick={()=>setOpenModal(true)}>
                    <svg className="svg fill" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                    </button>
                </div>
            <div className="profile-list">
                {chatlist.users.map(user => {return <ProfileCards data={user} state={chatlistDispatch}/>})}
            </div>

           {chatlist.selectedUser &&<div className="chat-area">
                <div className="profile-bar">
                    <div className="info">
                        <img className="profile-picture" alt="" src={chatlist.selectedUser.avatar} ></img>
                        <h3> {chatlist.selectedUser.groupName} </h3>
                    </div>
                    <div className="chat-action">
                        <Link to="/user-settings">
                           <svg className="svg"  viewBox="0 0 512 512"><path d="M262.29 192.31a64 64 0 1 0 57.4 57.4a64.13 64.13 0 0 0-57.4-57.4zM416.39 256a154.34 154.34 0 0 1-1.53 20.79l45.21 35.46a10.81 10.81 0 0 1 2.45 13.75l-42.77 74a10.81 10.81 0 0 1-13.14 4.59l-44.9-18.08a16.11 16.11 0 0 0-15.17 1.75A164.48 164.48 0 0 1 325 400.8a15.94 15.94 0 0 0-8.82 12.14l-6.73 47.89a11.08 11.08 0 0 1-10.68 9.17h-85.54a11.11 11.11 0 0 1-10.69-8.87l-6.72-47.82a16.07 16.07 0 0 0-9-12.22a155.3 155.3 0 0 1-21.46-12.57a16 16 0 0 0-15.11-1.71l-44.89 18.07a10.81 10.81 0 0 1-13.14-4.58l-42.77-74a10.8 10.8 0 0 1 2.45-13.75l38.21-30a16.05 16.05 0 0 0 6-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 0 0-6.07-13.94l-38.19-30A10.81 10.81 0 0 1 49.48 186l42.77-74a10.81 10.81 0 0 1 13.14-4.59l44.9 18.08a16.11 16.11 0 0 0 15.17-1.75A164.48 164.48 0 0 1 187 111.2a15.94 15.94 0 0 0 8.82-12.14l6.73-47.89A11.08 11.08 0 0 1 213.23 42h85.54a11.11 11.11 0 0 1 10.69 8.87l6.72 47.82a16.07 16.07 0 0 0 9 12.22a155.3 155.3 0 0 1 21.46 12.57a16 16 0 0 0 15.11 1.71l44.89-18.07a10.81 10.81 0 0 1 13.14 4.58l42.77 74a10.8 10.8 0 0 1-2.45 13.75l-38.21 30a16.05 16.05 0 0 0-6.05 14.08c.33 4.14.55 8.3.55 12.47z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="20"></path></svg>
                        </Link>
                    </div>
                </div>
                <div className="chats">
                    {console.log(chatlist.messages)}
                    {
                        chatlist.messages.map(message => {return <Message data={message} user={chatlist.userInfo.id}/>})
                    }
                    
                </div>

                <div className="chat-input">
                     { chatlist.emojipicker && <Picker set='apple' className="emoji" style={{ position: 'absolute', bottom: '3.3rem', left: '1rem' }} />}
                     <button className="emoji-picker" onClick={()=>chatlistDispatch({type:"EMOJI-PICKER", payload:true})}>
                         <svg className="chat-svg" viewBox="0 0 16 16"><g ><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75a.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25a.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"></path></g></svg>
                     </button>
                     <input className="message-holder" placeholder="Type a message" onChange={(e)=>setMessageInput(e.target.value)}></input>
                     <button className="emoji-picker s-btn" onClick={sendMessage}>
                     <svg className="chat-svg" viewBox="0 0 16 16"><g fill="none"><path d="M1.177 1.119a.5.5 0 0 1 .547-.066l13 6.5a.5.5 0 0 1 0 .894l-13 6.5a.5.5 0 0 1-.702-.594L2.977 8L1.022 1.647a.5.5 0 0 1 .155-.528zM3.869 8.5l-1.547 5.03L13.382 8L2.322 2.47L3.869 7.5H9.5a.5.5 0 0 1 0 1H3.87z"></path></g></svg>
                     </button>
                 </div>
            </div>}

           { openModal && <div className="wrapper">
                <div className="create-group-modal">
                    <h3>Create Group</h3>
                    <div>
                        <p>Group Name</p>
                        <input type="text" onChange={(e)=>chatlistDispatch({type:"SET-GROUP-NAME",payload:e.target.value})}/>
                    </div>
                    <div>
                        <p>Agenda</p>
                        <input type="text" onChange={(e)=>chatlistDispatch({type:"SET-AGENDA",payload:e.target.value})}/>
                    </div>
                    <div>
                    <button className="create" onClick={createGroup}>Create Group</button>
                    <button className="create close" onClick={()=>setOpenModal(false)}>Close</button>
                    </div>
                </div>
            </div>}

        </div>
    )
}


function chatlistDispatcher(state,action){
    switch(action.type){
        case "EMOJI-PICKER":
            return {...state,emojipicker:!state.emojipicker}
        case "USER-INFO":
            return {...state,userInfo:action.payload}
        case "UPDATE-USER":
            return {...state,users:[...state.users,action.payload]}
        case "SELECT-USER":
            console.log("Clicked",action.payload)
            return {...state,selectedUser:action.payload}
        case "SET-GROUP-NAME":
            return {...state,groupName:action.payload}
        case "SET-AGENDA":
            return {...state,agenda:action.payload}
        case "ADD-MESSAGE":
            if(!state.messages.find(message => action.payload.id === message.id)){
            return {...state,messages:[...state.messages,action.payload]}
            }
            return state
        case "EMPTY-MESSAGE":
            return {...state,messages:[]}
    }
}