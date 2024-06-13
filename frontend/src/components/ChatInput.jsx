import React, {useState} from 'react'
import axios from '../api/axios';


const CHAT_URL = '/api/chatting'
const PREDICT_URL = '/api/predict'



const ChatInput = ({onSendMessage}) => {
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) =>{

        e.preventDefault();
        onSendMessage({"role": "user", "content" : message});

        const temp_msg = message;
        setMessage('');
        
        try {

            const response = await axios.post(CHAT_URL, JSON.stringify({
                'message' : temp_msg
            }),
                {  
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true,
                }
                ); 
    
            onSendMessage({"role": 'assistant', "content": response.data["chat"]});
        } catch (err) {
            console.error('Failed to send message:', err);
        }
        
    
    }

    const get_prediction = async(e) =>{
        e. preventDefault();
        try {

            const response = await axios.get(PREDICT_URL,
                {  
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true,
                }
                ); 
    
            onSendMessage({"role": 'assistant', "content": response.data["prediction"]});
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    }


  return (
    <>
        <div className="flex items-center justify-center">
            <form onSubmit={handleSubmit} >
                
                <input
                type = "text" 
                value = {message} 
                onChange={(e) => setMessage(e.target.value)}
                className='input-box'
                />
                <button className='text-white bg-black hover:bg-gray-600 hover:text-white rounded-md px-3 py-2 ml-1 mr-2'
                type="submit"
                disabled={message ?  false : true}> Send </button>
            </form>
            <button 
            onClick = {get_prediction}
            className='text-white bg-black hover:bg-gray-600 hover:text-white rounded-md px-3 py-2 ml-1 mr-2'>Your MBTI</button>
        </div>
        
    </>
  )
}

export default ChatInput
