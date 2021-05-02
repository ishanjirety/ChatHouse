import React from 'react'
import firebase from 'firebase'
import { useAuth } from '../context'
import { useNavigate } from 'react-router-dom'
import {setToken} from '../Token/Token'
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

export const auth = firebase.auth()
const googleProvider = new firebase.auth.GoogleAuthProvider()
export function Login() {
    const navigate = useNavigate()
    const { loggedIn,setLoggedin } = useAuth()
    async function SignInWithGoogle(){
        try{
            const user = await auth.signInWithPopup(googleProvider)
            setLoggedin(true)
            setToken(user.credential.idToken,user.additionalUserInfo.profile.email)
            const users = await firestore.collection('users').get()
            let arr = []
            users.docs.map(async (docs) => {
                arr = [...arr,docs.data()]                
            })
            console.log(arr)
            if(arr.find(users => users.email === user.additionalUserInfo.profile.email )===undefined){
                await firestore.collection('users').add({
                    activeGroups:[],
                    avatar:"",
                    chats:[],
                    createdAt:"",
                    email:user.additionalUserInfo.profile.email,
                    status:"online",
                    username:""
                })
            }
          
            navigate('/')
        }catch(e){
            console.log(e)
            setLoggedin(false)
        }
    }
    return (
        <div>
            <button onClick={SignInWithGoogle}>Login</button>
        </div>
    )
}

