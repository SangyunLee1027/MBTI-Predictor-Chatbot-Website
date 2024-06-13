import React from 'react'
import logo from '../assets/images/logo.png'
import {NavLink} from 'react-router-dom'
import useAuth from "../hooks/useAuth"
import axios from '../api/axios';


const SIGNOUT_URL = '/auths/signout'

const Navbar = () => {

  const linkClass = ({isActive}) => isActive ? 'text-white bg-black hover:bg-gray-600 hover:text-white rounded-md px-3 py-2' : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  const { auth, setAuth } = useAuth();

  const Logout= async() =>{
    try {

      const response = await axios.post(SIGNOUT_URL, 
        {   
          withCredentials: true,
        }
      );
      
      setAuth({});

      console.log(response.data.message)
      

    } catch (err) {
      console.error(err);
    }
  }

  return ( auth?.email ? 
  <nav className="bg-purple-700 border-b border-purple-500">
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="flex h-20 items-center justify-between">
        <div
          className="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          {/* <!-- Logo --> */}
          <NavLink className="flex flex-shrink-0 items-center mr-4" 
          to="/">
            <img
              className="h-12 w-auto"
              src={logo}
              alt="MBTI Predictor Chatbot"
            />

          </NavLink>
          <div className="md:ml-auto">
            <div className="flex space-x-2">
              <h3 className = 'text-white text-lg rounded-md px-3 py-2'>Welcome! {auth.name}</h3>
              
              <NavLink
                to="/"
                className={linkClass}
                >Home
              </NavLink>
              <NavLink
                to="/chatpage"
                className={linkClass}
                >To Chat</NavLink>

              <NavLink
                to="/"
                className='text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
                onClick = {Logout}
                >Logout</NavLink>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav> :
    <nav className="bg-purple-700 border-b border-purple-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div
            className="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
          >
            {/* <!-- Logo --> */}
            <NavLink className="flex flex-shrink-0 items-center mr-4" 
            to="/">
              <img
                className="h-12 w-auto"
                src={logo}
                alt="MBTI Predictor Chatbot"
              />

            </NavLink>
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <NavLink
                  to="/"
                  className={linkClass}
                  >Home
                </NavLink>
                <NavLink
                  to="/signin"
                  className={linkClass}
                  >Sign In</NavLink>
                <NavLink
                  to="/register"
                  className={linkClass}
                  >Sign Up</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar
