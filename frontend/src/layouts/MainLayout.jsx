import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const MainLayout = () => {
  return (
    <div className="bg-purple-200 min-h-screen">
        <Navbar/>
      <Outlet />
      <ToastContainer/>
    </div>
  )
}

export default MainLayout
