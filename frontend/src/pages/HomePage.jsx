import React, {useEffect, useState} from 'react';
import HomeCards from '../components/HomeCards';
import Hero from '../components/Hero';
import axios from '../api/axios';
import useAuth from "../hooks/useAuth"
import HomeCards_SignIn from '../components/HomeCards_SignIn';


const USER_URL = '/auths/user'
const SIGNOUT_URL = '/auths/signout'


const HomePage = () => {

  const { auth, setAuth } = useAuth();
  

  
  useEffect(() => {
    
    const getUsers = async() => {
      try {

        const response = await axios.get(USER_URL, 
          {   
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
          }
        );
        
        const email = response.data.email;
        const name = response.data.name;
        const accessToken = response.data.accessToken;

        setAuth({email, name, accessToken});
        
      } catch (err) {
        setAuth({});
        console.error(err);
      }
    }
  


    getUsers();



    
  },[]);


  

  return (
    auth?.email ? 
    <>
      <Hero/>
      <HomeCards_SignIn/>
    </> :
    <>
      <Hero/>
      <HomeCards/>
    </>
  )
}

export default HomePage

