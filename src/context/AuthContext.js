import React,{useContext,createContext,useState} from 'react'


const Auth = createContext()
export function AuthContext({children}) {
    const [loggedIn,setLoggedin] = useState(false)
    return (
        <Auth.Provider value={{loggedIn,setLoggedin}}>
            {children}
        </Auth.Provider>
    )
}
export function useAuth(){
    return useContext(Auth)
}
