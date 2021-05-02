import React from 'react'
import './Assets/css/Nav.css'
import './Assets/css/NavResponsive.css'

import { NavLink } from 'react-router-dom'

export function Nav() {
    return (
        <nav className="nav">
            <NavLink to="/chat" className="nav-link" >
            <svg className="svg fill" viewBox="0 0 256 256"><path d="M230 96a14.016 14.016 0 0 0-14-14h-34V48a14.016 14.016 0 0 0-14-14H40a14.016 14.016 0 0 0-14 14v128a6 6 0 0 0 9.772 4.666L73.705 150H74l.001 34a14.016 14.016 0 0 0 14 14h94.295l37.933 30.666A6 6 0 0 0 230 224zM71.583 138a6.001 6.001 0 0 0-3.772 1.334L38 163.434V48a2.002 2.002 0 0 1 2-2h128a2.002 2.002 0 0 1 2 2v88a2.002 2.002 0 0 1-2 2zm116.607 49.334a6.001 6.001 0 0 0-3.772-1.334H88.001a2.002 2.002 0 0 1-2-2L86 150h82a14.016 14.016 0 0 0 14-14V94h34a2.002 2.002 0 0 1 2 2l.001 115.435z"></path></svg>
            <span className="active-icon"></span>
            <span className="notification nav-notification">1</span>
            </NavLink>
            <NavLink className="nav-link" to="/path">
                 <svg className="svg" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" ></path></svg>
                 <span className="active-icon"></span>
                 <span className="notification nav-notification">9+</span>
            </ NavLink>
            <NavLink className="nav-link" to="/path">
                    <svg className="svg fill" viewBox="0 0 512 512"><path d="M427.68 351.43C402 320 383.87 304 383.87 217.35C383.87 138 343.35 109.73 310 96c-4.43-1.82-8.6-6-9.95-10.55C294.2 65.54 277.8 48 256 48s-38.21 17.55-44 37.47c-1.35 4.6-5.52 8.71-9.95 10.53c-33.39 13.75-73.87 41.92-73.87 121.35C128.13 304 110 320 84.32 351.43C73.68 364.45 83 384 101.61 384h308.88c18.51 0 27.77-19.61 17.19-32.57z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></path><path d="M320 384v16a64 64 0 0 1-128 0v-16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></path></svg>
                <span className="active-icon"></span>
                <span className="notification nav-notification">3</span>
            </NavLink>
            <NavLink className="nav-link" to ="/path">
            <svg className="svg fill" viewBox="0 0 256 256"><path d="M230 128a102 102 0 1 0-170.773 75.26a5.962 5.962 0 0 0 1.177 1.054a101.789 101.789 0 0 0 135.196-.003a5.95 5.95 0 0 0 1.168-1.046A101.753 101.753 0 0 0 230 128zm-192 0a90 90 0 1 1 155.514 61.64a77.582 77.582 0 0 0-40.003-31.385a46 46 0 1 0-51.022 0a77.58 77.58 0 0 0-40.003 31.385A89.671 89.671 0 0 1 38 128zm56-8a34 34 0 1 1 34 34a34.039 34.039 0 0 1-34-34zm-22.557 77.953a66.028 66.028 0 0 1 113.113 0a89.803 89.803 0 0 1-113.113 0z" ></path></svg>
            <span className="active-icon"></span>
            </ NavLink >
        </nav>
    )
}
