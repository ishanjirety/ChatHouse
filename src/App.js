import {useState,useEffect} from 'react'

import './App.css';

import { Main,Login,Notifications } from './Pages'

import {Routes,Route} from 'react-router-dom'

import {PrivateRoute} from './PrivateRoutes'

import firebase from 'firebase/app'
import 'firebase/firestore'
import { getToken } from './Token/Token'
import { useUser } from './context'

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

function App() {
  const token = getToken() ? getToken() : {email:""}
  const [userId,setUserId] = useState()
  const {setNotifications} = useUser()
  useEffect(async () => {
  try{
    if(token.email !== ""){
      const user = await firestore.collection('users').get()
      user.docs.map(user => user.data().email === token.email && setUserId(user.id))
      firestore.collection('users').doc(userId).onSnapshot(querySnapshot=>{
        querySnapshot.data() && setNotifications(querySnapshot.data().notification.length)})
    }
  }catch(e){
    console.log(e.message)
  }
    
    // setNotifications(querySnapshot.data().notification.length)
    // setNotifications(querySnapshot.data().notification.length)
  },[firestore])
  return (
    <div className="App"> 
    <Routes>
      <PrivateRoute element={<Main />} path="/"/>
      <Route element={<Login />} path="/login"/>
      <PrivateRoute element={<Notifications/>} path="/notifications"/>
    </Routes>
    </div>
  );
}

export default App;

