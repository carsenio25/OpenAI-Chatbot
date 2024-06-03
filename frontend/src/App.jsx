import { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState([])

  const sendMessage = async () => {
    if (!message) return;
    setConversation([...conversation, {role: 'user', content: message }])
    try {
      const response = await axios.post('http://localhost:3000/message', { message });
      setConversation(conversation => [...conversation, { role: 'system', content: response.data.botMessage}])
      setMessage('')
    } catch (error){
      console.error('Error sending message', error)
    }
      
   }
  

  return (
    <>
      <div>
        {conversation.map((msg, index) => (
          <div key={index}>
            {msg.content}
            </div>
        ))}
      </div>
      <input 
      value={message}
      onChange={e => setMessage(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && sendMessage()}
      ></input>
      <button onClick={sendMessage}>Send</button>


    </>
  )
}

export default App
