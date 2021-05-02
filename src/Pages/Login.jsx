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
            console.log(user)
            setLoggedin(true)
            setToken(user.credential.idToken,user.additionalUserInfo.profile.email)
            const users = await firestore.collection('users').get()
            let arr = []
            users.docs.map(async (docs) => {
                arr = [...arr,docs.data()]                
            })
            if(arr.find(users => users.email === user.additionalUserInfo.profile.email )===undefined){
                await firestore.collection('users').add({
                    activeGroups:[],
                    avatar:user.additionalUserInfo.profile.picture,
                    chats:[],
                    createdAt:"",
                    email:user.additionalUserInfo.profile.email,
                    status:"online",
                    username:user.additionalUserInfo.profile.name,
                    permissions:[],
                    notification:[]
                })

            }
          
            navigate('/')
        }catch(e){
            console.log(e)
            setLoggedin(false)
        }
    }
    return (
        <div className="wrapper login">
            
            <div className="login-wrapper">
            <div className="login-header">Login</div>
                <button className='login-google' onClick={SignInWithGoogle}><svg viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0C7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"></path><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"></path><path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9c0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"></path><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"></path></svg> Login with google</button>
            </div>
        </div>
    )
}

