import React from 'react'
import './Assets/css/PageResponsive.css'
import { Nav,Chatlist } from '../Components'
import {Routes,Route} from 'react-router-dom'

export function Main() {
    return (
        <div className="main">
            <Nav />
            <Chatlist />
        </div>
    )
}


