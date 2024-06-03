import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState([])
  const [threads, setThreads] = useState([]);
  const [threadId, setThreadId] = useState(null);

  useEffect(() => {
    fetchThreads();
  }, []);


  const fetchThreads = async () => {
    try {
      const response = await axios.get('http://localhost:3000/threads');
      setThreads(response.data.threads); // assuming the response has a threads array
    } catch (error) {
      console.error('Failed to fetch threads', error);
    }
  };

  const selectThread = async (threadId) => {
    try {
      const response = await axios.get(`http://localhost:3000/conversation/${threadId}`);
      setConversation(response.data.messages); // assuming the response has the messages array
      setThreadId(threadId); // set the current thread ID
    } catch (error) {
      console.error('Failed to load conversation', error);
    }
  };


  const sendMessage = async () => {
    if (!message) return;
  
    const newMessage = { role: 'user', content: message };
    const updatedConversation = [...conversation, newMessage]; // Create the updated conversation array
  
    setConversation(updatedConversation); // Update the conversation state
  
    try {
      const response = await axios.post('http://localhost:3000/message', {
        conversation: updatedConversation, // Use the updated conversation here
        threadId
      });
  
      const botMessage = { role: 'system', content: response.data.botMessage };
      setConversation(prevConversation => [...prevConversation, botMessage]); // Update with the bot's response
      setThreadId(response.data.threadId); // Store threadId returned from the server
      setMessage('');
    } catch (error) {
      console.error('Error sending message', error);
    }
  }
  
  

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '20vw', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h3>Threads</h3>
        <ul>
          {threads.map(thread => (
            <li key={thread.id} onClick={() => selectThread(thread.id)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
              Thread {thread.id}
            </li>
          ))}
        </ul>
      </div>
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
    </div>
  );
}

export default App;