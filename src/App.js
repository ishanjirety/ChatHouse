import {useEffect,useState} from 'react'

import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'

import { Main,Login } from './Pages'

import {Routes,Route} from 'react-router-dom'

import {PrivateRoute} from './PrivateRoutes'

import {getToken} from './Token/Token'

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
  const [messages , setMessages] = useState([])
  useEffect(() => {
    (async function updateMessage(){const collection = firestore.collection('messages')
    const users = collection.orderBy('createdAt').limit(100).onSnapshot(querySnapshot=> {
      const data = querySnapshot.docs.map(doc => ({...doc.data(),id:doc.id}))
      setMessages(data)
    })
    return users
    })()
  }, [firestore])
  return (
    <div className="App"> 
      {/* {messages.map(doc => {
      return <p className="bg-red-500 hover:bg-red-700">{doc.message}</p>
    })
    } */}
    <Routes>
      <PrivateRoute element={<Main />} path="/"/>
      <Route element={<Login />} path="/login"/>
    </Routes>
    </div>
  );
}

export default App;

