import React from 'react'
import './Assets/css/Nav.css'
import './Assets/css/NavResponsive.css'
import {useUser} from '../../context'
import { NavLink } from 'react-router-dom'
import {logout} from '../../Token/Token'

export function Nav() {
    const {notifications} = useUser()
    return (
        <nav className="nav">
            <NavLink className="nav-link" to="/">
                 <svg className="svg" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" ></path></svg>
                 <span className="active-icon"></span>
            </ NavLink>
            <NavLink className="nav-link" to="/notifications">
                    <svg className="svg fill" viewBox="0 0 512 512"><path d="M427.68 351.43C402 320 383.87 304 383.87 217.35C383.87 138 343.35 109.73 310 96c-4.43-1.82-8.6-6-9.95-10.55C294.2 65.54 277.8 48 256 48s-38.21 17.55-44 37.47c-1.35 4.6-5.52 8.71-9.95 10.53c-33.39 13.75-73.87 41.92-73.87 121.35C128.13 304 110 320 84.32 351.43C73.68 364.45 83 384 101.61 384h308.88c18.51 0 27.77-19.61 17.19-32.57z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></path><path d="M320 384v16a64 64 0 0 1-128 0v-16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></path></svg>
                <span className="active-icon"></span>
                {notifications > 0 && <span className="notification nav-notification">{notifications}</span>}
            </NavLink>
            <NavLink className="nav-link fill" to ="/login" onClick={logout}>
            <svg className="svg" viewBox="0 0 512 512"><path  fill="var(--white-color)" d="M77.155 272.034H351.75v-32.001H77.155l75.053-75.053v-.001l-22.628-22.626l-113.681 113.68l.001.001h-.001L129.58 369.715l22.628-22.627v-.001l-75.053-75.053z"></path><path fill="var(--white-color)" d="M160 16v32h304v416H160v32h336V16H160z"></path></svg>
            </ NavLink >
        </nav>
    )
}
