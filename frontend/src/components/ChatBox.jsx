import React,{useRef, useState, useEffect}  from 'react'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import axios from '../api/axios';


const LOAD_MSG_URL = '/api/load_chats'


const ChatBox = () => {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const loadMsg = async()=> {
            const response = await axios.get(LOAD_MSG_URL, 
                {   
                  withCredentials: true,
                }
              );
              
            setMessages(response.data)
        }
        
        loadMsg();

    }, []);
    


    const handleSendMessages = (newMessage) => {
        setMessages(messages => [...messages, newMessage]);
    };

  return (
    <div>
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={handleSendMessages}/>
    
      
    </div>
  )
}

export default ChatBox
