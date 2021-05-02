import React,{useContext,createContext,useState} from 'react'

const User = createContext()

export function UserContext({ children }) {
    const [notifications,setNotifications] = useState(0)
    return (
         <User.Provider value={{notifications,setNotifications}}>
            { children }
          </User.Provider>
    )
}
export function useUser(){
    return useContext(User)
}
