import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import OpenAI from "openai";
import cors from 'cors';


dotenv.config();
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());




app.post('/message', async (req, res) => {
    const { conversation } = req.body;
  
    const systemMessage = { role: "system", content: "You are a helpful assistant." };
    //const userMessage = { role: "user", content: message };
    //console.log(conversation)
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...conversation],
      });
  
      res.json({ botMessage: completion.choices[0].message.content });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
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

