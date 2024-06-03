import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
import { OpenAI } from 'openai';


const cors = require("cors");
app.use(cors());

dotenv.config();
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());



app.post('/message', async (req, res) => {
  const { message, context } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [...context, { role: "user", content: message }],
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
