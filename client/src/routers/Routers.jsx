import React from 'react'
import {Routes, Route, Navigate} from "react-router-dom"
import Home from "../pages/home/Home"
import History from '../pages/history/History'

const Routers = () => {
  return (
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="history/:id" element={<History/>}/>
    </Routes>
  )
}

export default Routers