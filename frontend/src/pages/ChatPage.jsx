import React, {useEffect, useState} from 'react';
import ChatBox from '../components/ChatBox'
import useAuth from "../hooks/useAuth"
import axios from '../api/axios';


const USER_URL = '/auths/user'


const ChatPage = () => {

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
    <>
      <ChatBox/>
    </>
  )
}

export default ChatPage
