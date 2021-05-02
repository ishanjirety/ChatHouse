import React from 'react'
import {Route,Navigate} from 'react-router-dom'
import {getToken} from '../Token/Token'
import {useAuth} from '../context'

export function PrivateRoute({path,...props}) {
    const {loggedIn,setLoggedin} = useAuth()
    const token = getToken() !== null ? getToken() : {token:false}
  if(token.token !== false){    
    setLoggedin(token.email)
    return <Route {...props} path={path} />
  }
    return <Navigate state={{ from: path }} replace to="/login" />
}

