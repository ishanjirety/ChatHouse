import React,{useState,useEffect,useReducer,useRef} from 'react'
import './Assets/css/Chatlist.css'
import './Assets/css/ChatListResponsive.css'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { ProfileCards } from '../ProfileCards/ProfileCards'
import { Link } from 'react-router-dom'
import logo from '../../Logo/Logo.svg'
import { Message } from '../Message/Message'
import {getToken} from '../../Token/Token'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage';

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
    const [chatlist,chatlistDispatch] = useReducer(chatlistDispatcher,{emojipicker:false,userInfo:"",users:[],selectedUser:"",groupName:"",agenda:"",messages:[],profileImage:""})
    const [messageinput,setMessageInput] = useState("")
    const [openModal,setOpenModal] = useState(false)
    const [profileImage,setProfileImage] = useState("https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg")
    const [image,setImage] = useState({})

    const {email} = getToken()
    const scroll = useRef()
    const upload = useRef()

    useEffect(() => {
        (async function updateMessage(){
        const collection = firestore.collection('users').onSnapshot(querySnapshot => {return querySnapshot.docs.map(doc => doc.data().email === email && chatlistDispatch({type:"USER-INFO", payload:{...doc.data(),id:doc.id}}))})
        firestore.collection('Groups').onSnapshot(querySnapshot => querySnapshot.docs.map(docs=> chatlistDispatch({type:"UPDATE-USER",payload:{...docs.data(),id:docs.id}})))
        

        return collection
        })()
      }, [firestore])
      
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
            scroll.current.scrollIntoView({behaviour:'smooth'})
            setMessageInput("") 
      }
      async function createGroup(){
        if(chatlist.groupName !=="" && chatlist.agenda !=="" && image){
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(image.name)
        await fileRef.put(image)
        const imageURL = await fileRef.getDownloadURL()

        const group = await firestore.collection('Groups').add({
            groupName:chatlist.groupName,
            agenda:chatlist.agenda,
            createdAt : new Date(),
            admin : chatlist.userInfo.id,
            joinedUsers : [],
            requests : [],
            status : "public",
            avatar:imageURL
        })
        const getUser = await firestore.collection('users').doc(chatlist.userInfo.id).get()
        const updateUser = await firestore.collection('users').doc(chatlist.userInfo.id).update({activeGroups:[...getUser.data().activeGroups,group.id]})
        const collectionRef =firestore.collection('Groups').doc(group.id).collection('messages')
        await collectionRef.add({})
        setOpenModal(false)
      }
      }
      async function handleFileUpload(e){
    if(e.target.files){
        if((e.target.files[0].size/1000) < 1000){
         setProfileImage(URL.createObjectURL(e.target.files[0]))
         setImage(e.target.files[0])
        }
        else{
            console.log("high")
        }
    }
      }
      function uploadFile(){
        upload.current.click()
      }
     async function AskForPermissions(){
         console.log(chatlist.selectedUser)
          const notification = await firestore.collection('users').doc(chatlist.selectedUser.admin).get()
          const Newnotification = [...notification.data().notification,{userId:chatlist.userInfo.id,groupId:chatlist.selectedUser.id}]
          await firestore.collection('users').doc(chatlist.selectedUser.admin).update({notification:Newnotification})
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
                {chatlist.users.map(user => {return <ProfileCards data={user} user={chatlist.userInfo.id} state={chatlistDispatch}/>})}
            </div>

           {chatlist.selectedUser &&<div className="chat-area">
                <div className="profile-bar">
                    <div className="info">
                        <img className="profile-picture" alt="" src={chatlist.selectedUser.avatar} ></img>
                        <h3> {chatlist.selectedUser.groupName} </h3>
                    </div>
                </div>
                <div className="chats">
                    {
                        chatlist.messages.map(message => {return <Message data={message} user={chatlist.userInfo.id}/>})
                    }
                <div ref={scroll}></div>
                </div>
                {console.log(chatlist.userInfo.permissions)}
               {chatlist.selectedUser.admin === chatlist.userInfo.id || chatlist.userInfo.permissions.find(permssions=>permssions.groupId === chatlist.selectedUser.id) ? <div className="chat-input">
                     { chatlist.emojipicker && <Picker autoFocus={true} onSelect={(e)=>setMessageInput(messageinput+e.native)} set='apple' className="emoji" style={{ position: 'absolute', bottom: '3.3rem', left: '1rem' ,zIndex:"5"}} />}
                        <button className="emoji-picker" onClick={()=>chatlistDispatch({type:"EMOJI-PICKER", payload:true})}>
                            <svg className="chat-svg" viewBox="0 0 16 16"><g ><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75a.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25a.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"></path></g></svg>
                     </button>
                     <input className="message-holder" placeholder="Type a message" value={messageinput} onChange={(e)=>setMessageInput(e.target.value)}></input>
                     <button className="emoji-picker s-btn" onClick={sendMessage}>
                     <svg className="chat-svg" viewBox="0 0 16 16"><g fill="none"><path d="M1.177 1.119a.5.5 0 0 1 .547-.066l13 6.5a.5.5 0 0 1 0 .894l-13 6.5a.5.5 0 0 1-.702-.594L2.977 8L1.022 1.647a.5.5 0 0 1 .155-.528zM3.869 8.5l-1.547 5.03L13.382 8L2.322 2.47L3.869 7.5H9.5a.5.5 0 0 1 0 1H3.87z"></path></g></svg>
                     </button>
                 </div> : <div className="chat-input permission" ><button className="permission-btn" onClick={AskForPermissions}>Ask for permission ✋</button></div>}
            </div>}
            
           { openModal && <div className="wrapper">
                <div className="create-group-modal">
                    <h3>Create Group</h3>
                    <input type="file" ref={upload} accept="image/png,image/jpeg,image/jpg" className="group-icon" onChange={handleFileUpload}/>
                    <div>
                    <div className="upload" style={{backgroundImage:`url(${profileImage})`}}><div className="overlay" onClick={uploadFile}>
                    <svg className="svg" viewBox="0 0 256 256"><path d="M208 58h-28.795l-14.219-21.328A6 6 0 0 0 159.994 34h-64a6 6 0 0 0-4.992 2.672L76.783 58H48a22.025 22.025 0 0 0-22 22v112a22.025 22.025 0 0 0 22 22h160a22.025 22.025 0 0 0 22-22V80a22.025 22.025 0 0 0-22-22zm10 134a10.012 10.012 0 0 1-10 10H48a10.012 10.012 0 0 1-10-10V80a10.012 10.012 0 0 1 10-10h31.994a6 6 0 0 0 4.992-2.672L99.206 46h57.577l14.219 21.328A6 6 0 0 0 175.994 70H208a10.012 10.012 0 0 1 10 10zM128 90a42 42 0 1 0 42 42a42.047 42.047 0 0 0-42-42zm0 72a30 30 0 1 1 30-30a30.034 30.034 0 0 1-30 30z" fill="var(--text-color)"></path></svg></div></div>
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
            if(!state.users.find(user => user.id === action.payload.id)){
                return {...state,users:[...state.users,action.payload]}
            }return state
        case "SELECT-USER":
            console.log("Clicked",action.payload)
            return {...state,selectedUser:action.payload}
        case "SET-GROUP-NAME":    
            if(action.payload !== ""){
                return {...state,groupName:action.payload}       
        }return state
        case "SET-AGENDA":
            if(action.payload !== ""){
            return {...state,agenda:action.payload}
            }return state
        case "ADD-MESSAGE":
            if(!state.messages.find(message => action.payload.id === message.id)){
            return {...state,messages:[...state.messages,action.payload]}
            }
            return state
        case "EMPTY-MESSAGE":
            return {...state,messages:[]}
        case "PROFILE-IMAGE":
            return {...state,profileImage:action.payload}
    }
}