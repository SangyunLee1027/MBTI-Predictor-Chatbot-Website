import { useState } from 'react'
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import SigninPage from './pages/SigninPage'
import RequireAuth from './components/RequireAuth'
import { AuthProvider } from './context/AuthProvider'
import ChatPage from './pages/ChatPage'


function App() {

  const router =  createBrowserRouter(
    createRoutesFromElements(
      <Route path = '/' element={<MainLayout />}>
        <Route index element={<HomePage/>}/>
        <Route path='register/' element={<RegisterPage/>} />
        <Route path='signin/' element={<SigninPage/>} />
        <Route path='*' element={<NotFoundPage/>} />
        <Route path='chatpage/' element={<ChatPage/>} />
        
        <Route element={<RequireAuth/>}>

        </Route>
      
      </Route>
      
          )
      )
  
      return <AuthProvider><RouterProvider router = {router}/></AuthProvider>;
}

export default App
