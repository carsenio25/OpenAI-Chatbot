import { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState([])

  const sendMessage = async () => {
    if (!message) return;
  
    const newMessage = { role: 'user', content: message };
    setConversation(conversation => [...conversation, newMessage]);
  
    try {
      const response = await axios.post('http://localhost:3000/message', { conversation: [...conversation, newMessage] });
      setConversation(conversation => [...conversation, { role: 'system', content: response.data.botMessage }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message', error);
    }
  }
  

   return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '30vw', height: '80vh', margin: '2vh' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        {conversation.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              margin: '5px 0',
              marginBottom: '3vh'
            }}
          >
            <div
              style={{
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: msg.role === 'user' ? '#D1E8E4' : '#F7D9C4',
                maxWidth: '60%',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: '10px',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#00B4D8',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;