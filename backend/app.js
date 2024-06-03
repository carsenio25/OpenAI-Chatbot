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
    const { message, context = [] } = req.body;
  
    const systemMessage = { role: "system", content: "You are a helpful assistant. You also refer to the user as valued customer at all times" };
    const userMessage = { role: "user", content: message };
  
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...context, userMessage],
      });
  
      res.json({ botMessage: completion.choices[0].message.content });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });
  
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

