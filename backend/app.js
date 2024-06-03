import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import OpenAI from "openai";
import cors from 'cors';
import db from './firebase.js';
import admin from 'firebase-admin';



dotenv.config();
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());




app.post('/message', async (req, res) => {
    const { conversation, threadId } = req.body;

    const systemMessage = { role: "system", content: "You are a helpful assistant." };
    let docRef;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...conversation],
      });

      const botMessage = { role: 'system', content: completion.choices[0].message.content };

      if (threadId) {
        docRef = db.collection('conversations').doc(threadId);
        await docRef.update({
          messages: admin.firestore.FieldValue.arrayUnion(...conversation, botMessage)
        });
      } else {
        docRef = await db.collection('conversations').add({
          messages: [...conversation, botMessage]
        });
      }
      
      res.json({ threadId: docRef.id, botMessage: botMessage.content });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.get('/threads', async (req, res) => {
    try {
        const threadsRef = db.collection('conversations');
        const snapshot = await threadsRef.get();
        const threads = snapshot.docs.map(doc => ({
            id: doc.id,  // Each document's ID is the thread ID
            lastMessage: doc.data().messages.slice(-1)[0]  // You can include the last message as a preview
        }));
        res.json({ threads });  // Send the list of threads to the client
    } catch (error) {
        console.error('Error fetching threads:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


  app.get('/conversation/:id', async (req, res) => {
    const { id } = req.params;
    const conversationRef = db.collection('conversations').doc(id);
    const doc = await conversationRef.get();
  
    if (doc.exists) {
      res.json({ threadId: id, messages: doc.data().messages });
    } else {
      res.status(404).json({ error: 'Conversation not found' });
    }
  });
  
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

