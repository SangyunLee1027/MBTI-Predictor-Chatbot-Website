import React, { useEffect, useRef } from 'react'

const ChatMessages = ({messages}) => {

    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);


  return (
    <div className='chat-container' >
        <div className="just_for_center" ref={containerRef}>
            <ul>
            {messages.map((msg, index) => (
                <li key={index} 
                className={msg.role=='user' ? "chatbox-user " : "chatbox-bot"}>
                    {msg.content}</li>
            ))}
            </ul>
        </div>
    </div>
    
  )
}

export default ChatMessages
